<?php

namespace App\Http\Controllers;

use Exception;
use Carbon\Carbon;
use App\Models\Cycle;
use App\Models\Member;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\Welfare;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Imports\MembersImport;
use App\Imports\MembersImport2024;
use App\Imports\NewPaymentsImport;
use Illuminate\Support\Facades\DB;
use App\Imports\NewMembersPayments;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\NewMembersPayments2024;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\UpdateController;
use App\Http\Controllers\FinancesController;

class NewLedgerController extends Controller
{
    // IMPORT YEAR LEDGER EXCEL SHEET 
    public function getLedgerMainInfo(Request $request, $year)
    {
        if ($year >= 2024) {
            $info = $this->getLedgerInfo2024($request, $year);
        } else {
            $info = $this->getLedgerInfoOthers($request, $year);
        }

        return $info;
    }

    public function getLedgerInfoOthers(Request $request, $year)
    {
        // Validate the Excel file
        $request->validate(
            [
                'excel'          => 'required|mimes:xlsx, csv, xls|max:10240'
            ],
            [
                'excel.required' => 'File Ledger is required!',
                'excel.mimes'    => 'Wrong File Format, Upload an excelsheet!',
                'excel.max'      => 'This file is to big too be uploaded!',
            ]
        );

        // Read the file
        $collection = Excel::toCollection(new MembersImport, $request->file('excel'))[0];

        // confirm names on the spreadsheet against the ones in the DB
        $existingMembers = $this->nameCheck($collection);

        // Count existing members
        $existingCount = $existingMembers->count();

        // Get the list of new members by finding the difference between the sheet and existing members
        $existingNames = $existingMembers->pluck('name');

        // // Get the new members by finding the difference between the sheet and existing members
        // $newMembersCollection = $collection->filter(function ($row, $index) use ($existingNames) {
        //     return !$existingNames->contains($row[1]) && strtolower($row[1]) !== 'totals';  // Exclude rows with "totals"
        // });

        // Get the new members by finding the difference between the sheet and existing members
        $newMembersCollection = $collection->filter(function ($row, $index) use ($existingNames) {
            // Check if 'members_name' exists and is not 'TOTALS'
            $name = $row[1];
            // Sanitize the name
            $name = $this->sanitizeName($name);

            return (!$existingNames->contains($name)) && strtolower(empty($name)) !== 'totals'; // Exclude rows with "totals"
        });

        // Create the new_members array with id and name in the same format as existing_members
        $newMembers = [];
        foreach ($newMembersCollection as $index => $row) {
            if (!is_null($row[1])) {
                $newMembers[] = [
                    'id'                    => $index + 1,      // ID (index) in the Excel sheet
                    'name'                  => $row[1],     // Name in the second column
                    'telephone'             => $row[2],     // telephone in the third column
                    'amount_before'         => $row[3],         // amount_before in the fourth column
                    'welfare_before'        => $row[4],         // welfare_before in the fifth column
                    'welfareowed_before'    => $row[5],         // welfareowed_before in the sixth column
                    'active'                => true,
                    'exists'                => false,
                ];
            }
        }

        // Count new members
        $newCount = count($newMembers);

        // if existing members 
        if ($existingCount > 0) {
            $exist = true;
        } else {
            $exist = false;
        }

        // Return the data (existing count, new count, list of existing members with id and name, and new members)
        $newExistingMembers = $existingMembers->map(function ($member) {
            return [
                'id'                    => $member->id,
                'name'                  => $member->name,
                'telephone'             => $member->telephone,
                'total_in'              => $member->total_in,
                'amount_before'         => $member->amount_before,
                'welfare_before'        => $member->welfare_before,
                'welfareowed_before'    => $member->welfareowed_before,
                'active'                => $member->active,
                'exists'                => true,  // Existing members exist
            ];
        })->toArray();

        // Merge both arrays into a single 'all_members' array
        $allMembers = array_merge($newExistingMembers, $newMembers);

        // Load the Excel sheet
        $data = Excel::toCollection(new NewMembersPayments, $request->file('excel'))[0];

        // Remove irrelevant rows and process data (e.g., 'totals' row)
        $data = $data->filter(function ($row) {
            return $row['members_name'] !== 'TOTALS';  // Assuming the 'Members Name' is in the second column
        });

        // Extract each member and their contributions per month
        $memberContributions = $data->map(function ($row) {
            return [
                'name'                      => $row['members_name'],
                'telephone'                 => $row['telephone_no'],
                'total_contributions_bf'    => $row['total_contributions_bf'],
                'total_contributions'       => $row['total_contributions'],
                'total_welfare'             => $row['total_welfare'],
                'welfare_owing'             => $row['welfare_owing'],
                'total_investment'          => $row['total_investment'],
            ];
        }); 

        // Remove irrelevant rows and process data (e.g., 'totals' row)
        $memberContributions = $memberContributions->filter(function ($row) {
            return $row['name'] !== null;  // Assuming the 'Members Name' is in the second column
        });

        // Initialize an array to store contributions grouped by month
        $monthlyContributions = [
            'January'   => [],
            'February'  => [],
            'March'     => [],
            'April'     => [],
            'May'       => [],
            'June'      => [],
            'July'      => [],
            'August'    => [],
            'September' => [],
            'October'   => [],
            'November'  => [],
            'December'  => []
        ];

        // Loop through each member and their contributions
        foreach ($data as $row) {
            // Add member's contribution to each month only if amount is greater than 0
            foreach ($monthlyContributions as $month => &$contributions) {
                $lowerCaseMonth = strtolower($month); // Convert month name to match the column in Excel
                $amount = $row[$lowerCaseMonth] ?? 0; // Get the amount, default to 0 if missing

                $member = Member::where([['name', $row['members_name']]])->first();
                $cycle  = Cycle::where([['month', strtoupper($month)], ['year', $year]])->first();

                if ($amount > 0) {  // Only include if amount is greater than 0
                    if ($member) {
                        if ($cycle) {
                            if (Payment::where([['payment', $amount], ['member_id', $member->id], ['cycle_id', $cycle->id]])->exists()) {
                                $payment = Payment::where([['payment', $amount], ['member_id', $member->id], ['cycle_id', $cycle->id]])->first();
                                $exists = true;
                                $payId = $payment->id;
                                $cycleID = $cycle->id;
                                $memID = $member->id;
                            } else {
                                $exists = false;
                                $payId = '0';
                                $cycleID = $cycle->id;
                                $memID = $member->id;
                            }
                        } else {
                            $exists = false;
                            $payId = '0';
                            $cycleID = '0';
                            $memID = $member->id;
                        }
                    } else {
                        $exists = false;
                        $payId = '0';
                        $cycleID = '0';
                        $memID = '0';
                    }

                    if ($row['members_name']) {
                        $contributions[] = [
                            'name'          => $row['members_name'],
                            'telephone'     => $row['telephone_no'],
                            'amount'        => $amount,
                            'exists'        => $exists,
                            'cycle_id'      => $cycleID,
                            'member_id'     => $memID,
                            'pay_id'        => $payId
                        ];
                    }
                }
            }
        }

        // Filter out months that have no contributions
        $monthlyContributions = array_filter($monthlyContributions, function ($contributions) {
            return count($contributions) > 0;  // Keep only months that have contributions
        });

        // Count months
        $monthCount = count($monthlyContributions);

        // Return the response as JSON
        return response()->json([
            'existing_count'        => $existingCount,
            'new_count'             => $newCount,
            'existing_members'      => $newExistingMembers,
            'new_members'           => $newMembers,
            'all_members'           => $allMembers,
            'exist'                 => $exist,
            'monthly_contributions' => $monthlyContributions,
            'months_count'          => $monthCount,
            'member_contributions'  => $memberContributions,
        ]);
    }

    public function getLedgerInfo2024(Request $request, $year)
    {
        // Validate the Excel file
        $request->validate(
            [
                'excel'          => 'required|mimes:xlsx, csv, xls|max:10240'
            ],
            [
                'excel.required' => 'File Ledger is required!',
                'excel.mimes'    => 'Wrong File Format, Upload an excelsheet!',
                'excel.max'      => 'This file is to big too be uploaded!',
            ]
        );

        // Read the file
        $collection = Excel::toCollection(new NewMembersPayments2024, $request->file('excel'))[0];

        // confirm names on the spreadsheet against the ones in the DB
        $existingMembers = $this->nameCheck2024($collection);

        // Count existing members
        $existingCount = $existingMembers->count();

        // Get the list of new members by finding the difference between the sheet and existing members
        $existingNames = $existingMembers->pluck('name');

        // Get the new members by finding the difference between the sheet and existing members
        $newMembersCollection = $collection->filter(function ($row, $index) use ($existingNames) {
            // Check if 'members_name' exists and is not 'TOTALS'
            $name = $row['members_name'];
            // Sanitize the name
            $name = $this->sanitizeName($name);

            return (!$existingNames->contains($name)) && strtolower(empty($name)) !== 'totals' && 'total' && null; // Exclude rows with "totals"
        });

        // Create the new_members array with id and name in the same format as existing_members
        $newMembers = [];
        foreach ($newMembersCollection as $index => $row) {
            // Check if members_name or name exists
            $name = $this->sanitizeName($row['members_name']);

            if (!is_null($name) && $name !== "") {
                // Sanitize the name
                $name = $this->sanitizeName($row['members_name']);

                $newMembers[] = [
                    'id'                        => $index + 1,      // ID (index) in the Excel sheet
                    'name'                      => $name,
                    'telephone'                 => $row['telephone_no'],
                    'amount_before'             => $row['total_contributions_bf'],
                    'total_contributions'       => $row['total_contributions'],
                    'welfare_before'            => $row['total_welfare_till_end_of_april_2024'],
                    'welfareowed_before'        => $row['welfare_owing_till_end_of_april_2024'],
                    'welfare_owing_may'         => $row['welfare_owing_from_may_2024'],
                    'total_investment'          => $row['total_investment'],
                    'age'                       => $row['age'],
                    'active'                    => true,
                    'exists'                    => false,
                ];
            }
        }

        // Count new members
        $newCount = count($newMembers);

        // if existing members 
        if ($existingCount > 0) {
            $exist = true;
        } else {
            $exist = false;
        }

        // Return the data (existing count, new count, list of existing members with id and name, and new members)
        $newExistingMembers = $existingMembers->map(function ($member) {
            return [
                'id'                    => $member->id,
                'name'                  => $member->name,
                'telephone'             => $member->telephone,
                'total_in'              => $member->total_in,
                'amount_before'         => $member->amount_before,
                'welfare_before'        => $member->welfare_before,
                'welfareowed_before'    => $member->welfareowed_before,
                'welfare_owing_may'     => $member->welfare_owing_may,
                'active'                => $member->active,
                'exists'                => true,  // Existing members exist
            ];
        })->toArray();

        // Merge both arrays into a single 'all_members' array
        $allMembers = array_merge($newExistingMembers, $newMembers);

        // Load the Excel sheet Payments 
        // Remove irrelevant rows and process data (e.g., 'totals' row)
        $data = $collection->filter(function ($row) {
            // Check if members_name or name exists
            $name = $this->sanitizeName($row['members_name']);
            return !$name !== 'TOTALS';  // Assuming the 'Members Name' is in the second column
        });

        // Extract each member and their contributions per month
        $memberContributions = $data->map(function ($row) {
            return [
                'name'                      => $this->sanitizeName($row['members_name']),
                'telephone'                 => $row['telephone_no'],
                'total_contributions_bf'    => $row['total_contributions_bf'],
                'total_contributions'       => $row['total_contributions'],
                'welfare_before'            => $row['total_welfare_till_end_of_april_2024'],
                'welfare_owing'             => $row['welfare_owing_till_end_of_april_2024'],
                'welfare_owing_may'         => $row['welfare_owing_from_may_2024'],
                'total_investment'          => $row['total_investment'],
                'age'                       => $row['age'],
            ];
        });

        // Remove irrelevant rows and process data (e.g., 'totals' row)
        $memberContributions = $memberContributions->filter(function ($row) {
            // Check if members_name or name exists
            $name = $row['name'];
            return $name !== null;  // Assuming the 'Members Name' is in the second column
        });

        // return $memberContributions;

        // Initialize an array to store contributions grouped by month
        $monthlyContributions = [
            'January'   => [],
            'February'  => [],
            'March'     => [],
            'April'     => [],
            'May'       => [],
            'June'      => [],
            'July'      => [],
            'August'    => [],
            'September' => [],
            'October'   => [],
            'November'  => [],
            'December'  => []
        ];

        // Loop through each member and their contributions
        foreach ($data as $row) {
            // Add member's contribution to each month only if amount is greater than 0
            foreach ($monthlyContributions as $month => &$contributions) {
                // Check if members_name or name exists
                $name = $this->sanitizeName($row['members_name']);

                $lowerCaseMonth = strtolower($month); // Convert month name to match the column in Excel
                $amount = $row[$lowerCaseMonth] ?? 0; // Get the amount, default to 0 if missing

                $member = Member::where([['name', $name]])->first();
                $cycle  = Cycle::where([['month', strtoupper($month)], ['year', $year]])->first();

                if ($amount > 0) {  // Only include if amount is greater than 0
                    if ($member) {
                        if ($cycle) {
                            if (Payment::where([['payment', $amount], ['member_id', $member->id], ['cycle_id', $cycle->id]])->exists()) {
                                $payment = Payment::where([['payment', $amount], ['member_id', $member->id], ['cycle_id', $cycle->id]])->first();
                                $exists = true;
                                $payId = $payment->id;
                                $cycleID = $cycle->id;
                                $memID = $member->id;
                            } else {
                                $exists = false;
                                $payId = '0';
                                $cycleID = $cycle->id;
                                $memID = $member->id;
                            }
                        } else {
                            $exists = false;
                            $payId = '0';
                            $cycleID = '0';
                            $memID = $member->id;
                        }
                    } else {
                        $exists = false;
                        $payId = '0';
                        $cycleID = '0';
                        $memID = '0';
                    }

                    if ($name != '') {
                        $contributions[] = [
                            'name'          => $name,
                            'telephone'     => $row['telephone_no'],
                            'amount'        => $amount,
                            'exists'        => $exists,
                            'cycle_id'      => $cycleID,
                            'member_id'     => $memID,
                            'pay_id'        => $payId
                        ];
                    }
                }
            }
        }

        // Filter out months that have no contributions
        $monthlyContributions = array_filter($monthlyContributions, function ($contributions) {
            return count($contributions) > 0;  // Keep only months that have contributions
        });

        // Count months
        $monthCount = count($monthlyContributions);

        // totals 
        $totalPays   = $memberContributions->sum('total_contributions');
        $totalIn     = $memberContributions->sum('welfare_before');
        $totalOwe    = $memberContributions->sum('welfare_owing');
        $totalOweMay = $memberContributions->sum('welfare_owing_may');
        $totalInv    = $memberContributions->sum('total_investment');

        // Return the response as JSON
        return response()->json([
            'existing_count'        => $existingCount,
            'new_count'             => $newCount,
            'existing_members'      => $newExistingMembers,
            'new_members'           => $newMembers,
            'all_members'           => $allMembers,
            'exist'                 => $exist,
            'monthly_contributions' => $monthlyContributions,
            'months_count'          => $monthCount,
            'member_contributions'  => $memberContributions,
            'total_pay'             => $totalPays,
            'total_in'              => $totalIn,
            'total_owe'             => $totalOwe,
            'total_owemay'          => $totalOweMay,
            'total_inv'             => $totalInv,
        ]);
    }

    public function sheetMembersExist(Request $request)
    {
        // Validate the Excel file
        $request->validate([
            'excel'                 => 'required|mimes:xlsx,csv,xls|max:10240',
        ], [
            'excel.required'        => 'An Excel file is required!',
            'excel.mimes'           => 'Only Excel files (xlsx, xls, csv) are allowed!',
            'excel.max'             => 'The file size should not exceed 10MB!',
        ]);

        // Read the file
        $collection = Excel::toCollection(new MembersImport2024, $request->file('excel'))[0];

        // confirm names on the spreadsheet against the ones in the DB
        $existingMembers = $this->nameCheck2024($collection);

        // Count existing members
        $existingCount = $existingMembers->count();

        // Get the list of new members by finding the difference between the sheet and existing members
        $existingNames = $existingMembers->pluck('name');

        // Get the new members by finding the difference between the sheet and existing members
        $newMembersCollection = $collection->filter(function ($row, $index) use ($existingNames) {
            // Check if 'members_name' exists and is not 'TOTALS'
            $name = !empty($row['members_name']) ? $row['members_name'] : $row['name'];
            // Sanitize the name
            $name = $this->sanitizeName($name);

            return (!$existingNames->contains($name)) && strtolower(empty($name)) !== 'totals'; // Exclude rows with "totals"
        });

        // Create the new_members array with id and name in the same format as existing_members
        $newMembers = [];
        foreach ($newMembersCollection as $index => $row) {
            // Check if members_name or name exists
            $name = !empty($row['members_name']) ? $row['members_name'] : $row['name'];

            if (!is_null($name)) {
                // Sanitize the name
                $name = $this->sanitizeName($name);

                $newMembers[] = [
                    'id'                    => $index + 1,      // ID (index) in the Excel sheet
                    'name'                  => $name,
                    'telephone'             => $row['telephone_no'],
                    'amount_before'         => $row['total_contributions_bf'],
                    'welfare_before'        => $row['welfare_bf'], 
                    'welfareowed_before'    => $row['welfare_owed_bf'], 
                    'welfare_owing_may'     => $row['welfare_owed_may'],
                    'active'                => true,
                    'exists'                => false,
                ];
            }
        }

        // return $newMembers;

        // Count new members
        $newCount = count($newMembers);

        // if existing members 
        if ($existingCount > 0) {
            $exist = true;
        } else {
            $exist = false;
        }

        // Return the data (existing count, new count, list of existing members with id and name, and new members)
        $newExistingMembers = $existingMembers->map(function ($member) {
            return [
                'id'                    => $member->id,
                'name'                  => $member->name,
                'telephone'             => $member->telephone,
                'total_in'              => $member->total_in,
                'amount_before'         => $member->amount_before,
                'welfare_before'        => $member->welfare_before,
                'welfareowed_before'    => $member->welfareowed_before,
                'welfare_owing_may'     => $member->welfare_owing_may,
                'active'                => $member->active,
                'exists'                => true,  // Existing members exist
            ];
        })->toArray();

        // Merge both arrays into a single 'all_members' array
        $allMembers = array_merge($newExistingMembers, $newMembers);

        // Return the data as an array (existing members count, new members count, the lists of both)
        return response()->json([
            'existing_count'        => $existingCount,
            'new_count'             => $newCount,
            'existing_members'      => $newExistingMembers,
            'new_members'           => $newMembers,
            'all_members'           => $allMembers,
            'exist'                 => $exist,
        ]);
    }

    // STORE MEMBERS LEDGER EXCEL SHEET 
    public function storeMembersLedger(Request $request)
    {
        // Check for a soft-deleted member with the same name
        $deletedMember = Member::onlyTrashed()->where('name', $request->name)->first();

        if ($deletedMember) {
            // Optionally restore the member if you want
            $deletedMember->restore(); // This will restore the member to active status

            // Optionally, you might want to prevent restoring if you want to allow unique names
            Member::where('id', $deletedMember->id)
                ->update([
                    'telephone'         => request('telephone'),
                    'amount_before'     => request('amount_before'),
                    'welfare_before'    => request('welfare_before'),
                    'welfare_owing_may' => $request->welfare_owing_may ?? '0'
                ]);

            // Instead of failing the validation, you can inform the user
            $message = "$request->name was previously deleted and has been restored.";
            $type = "danger";
        } else {
            // Check for existing active member
            $exists = Member::where('name', $request->name)->exists();

            if ($exists) {

                Member::where('name', $request->name)
                    ->update([
                        'telephone'         => request('telephone'),
                        'amount_before'     => request('amount_before'),
                        'welfare_before'    => request('welfare_before'),
                        'welfare_owing_may' => $request->welfare_owing_may ?? '0'
                    ]);

                // Instead of failing the validation, you can inform the user
                $message = "$request->name updated!";
                $type = "update";
            } else {
                // validate
                $request->validate([
                    'name'                  => 'required',
                    'telephone'             => 'required',
                    'amount_before'         => 'required',
                    'welfare_before'        => 'required'
                ], [
                    'name.required'         => 'Member name is required.',
                    'name.unique'           => 'Member name already exists. Enter another name.',
                    'telephone.required'    => 'The telephone is required.',
                    'amount_before.required'    => 'Amount before is required.',
                    'welfare_before.required'   => 'Welfare before is required.'
                ]);

                // create member 
                $member = Member::create([
                    'user_id'       => auth()->id(),
                    'name'          => request('name'),
                    'telephone'     => request('telephone'),
                    'amount_before' => request('amount_before'),
                    'welfare_before' => request('welfare_before')
                ]);

                if ($request->welfare_owing_may) {
                    Member::where('id', $member->id)
                        ->update([
                            'welfare_owing_may' => $request->welfare_owing_may ?? '0'
                        ]);
                }

                $message = "$request->name submitted!";
                $type = "newmembers";
            }
        }

        // update finances records
        $this->UpdateAll();

        // return back();
        return response()->json([
            'success' => true,
            'message' => $message,
            'type'    => $type
        ]);
    }

    // STORE MONTHS ON YEAR LEDGER EXCEL SHEET 
    public function storeCyclesLedger($month, $year)
    {
        // get settings 
        $setting    = Setting::first();
        // get date, month & year
        // $date       = Carbon::parse($month)->setYear($year)->firstOfMonth()->addDay(1);
        $monthNumber = date('n', strtotime($month)); // Convert "January" to 1, "February" to 2, etc.
        $date = Carbon::create($year, $monthNumber)->firstOfMonth()->addDay(1);
        // return $date;

        // members total
        $members    = DB::table('members')->where([['deleted_at', null], ['active', true]])->count();

        // total amnt
        $total      = $members * $setting->payment_def;

        // Try to find an existing cycle or create a new one
        $cycle = Cycle::firstOrNew(
            [
                'month' => strtoupper($month),
                'year'  => $year
            ]
        );

        // Determine if the cycle is new or existing
        $isNewCycle = !$cycle->exists;

        // get name 
        $name = strtoupper($month . ' ' . $year);

        // Fill or update the cycle attributes
        $cycle->fill([
            'user_id'       => auth()->id(),
            'name'          => $name,
            'date'          => $date,
            'amount'        => $setting->payment_def,
            'welfare_amnt'  => $setting->welfare_def,
            'members_no'    => $members,
            'total'         => $total,
        ]);

        // Save the cycle
        $cycle->save();

        // Set the appropriate message based on whether the cycle was newly created or updated
        $message = $isNewCycle ? $cycle->name . ' was created!' : $cycle->name . ' was updated!';
        $type    = $isNewCycle ? 'success' : 'info';

        // Return the response as JSON
        return response()->json([
            'name'                  => $cycle->name,
            'id'                    => $cycle->id,
            'message'               => $message,
            'type'                  => $type,
        ]);
    }

    // STORE PAYMENTS ON CYCLE MONTHS LEDGER EXCEL SHEET 
    public function storePaysLedger(Request $request, Cycle $cycle)
    {
        // validate
        request()->validate(
            [
                'member_id'         => 'required',
                'amount'            => 'required',
            ],
            [
                'member_id.required'         => 'Member ID is requored',
                'amount.required'            => 'Payment Amount is required',
            ],
        );

        // Try to find an existing payment or create a new one
        $payment = Payment::firstOrNew(
            [
                'member_id' => strtoupper($request->member_id),
                'cycle_id'  => $cycle->id
            ]
        );

        // Determine if the cycle is new or existing
        $isNewPayment = !$payment->exists;

        // get name 
        $name = request('name');

        // Fill or update the payment attributes
        $payment->fill([
            'user_id'       => auth()->id(),
            'payment'       => $request->amount
        ]);

        // Save the payment
        $payment->save();

        // Set the appropriate message based on whether the payment was newly created or updated
        $message = $isNewPayment
        ? "$name ksh " . number_format($payment->payment) . " - $cycle->name was created"
        : "$payment->name $name ksh " . number_format($payment->payment) . " - $cycle->name was updated";
        $type    = $isNewPayment ? 'payment' : 'update';

        // update finances records
        $this->UpdateAll();

        // Return the response as JSON
        return response()->json([
            'name'                  => $payment->payment,
            'id'                    => $payment->id,
            'message'               => $message,
            'type'                  => $type,
        ]);
    }

    // STORE PAYMENTS & WELFARES ON A SINGLE CYCLE MONTHLY LEDGER EXCEL SHEET 
    public function storePaysMonthly(Request $request, Cycle $cycle)
    {
        // validate
        request()->validate(
            [
                'member_id'         => 'required',
            ],
            [
                'member_id.required'         => 'Member ID is requored',
            ],
        );

        // get name 
        $name = request('name');

        // Try to find an existing payment or create a new one
        if ($request->amount != null) {
            $payment = Payment::firstOrNew(
                [
                    'member_id' => strtoupper($request->member_id),
                    'cycle_id'  => $cycle->id
                ]
            );

            // Determine if the cycle is new or existing
            $isNewPayment = !$payment->exists;

            // Fill or update the payment attributes
            $payment->fill([
                'user_id'       => auth()->id(),
                'payment'       => $request->amount
            ]);

            // Save the payment
            $payment->save();

            //message
            $flashInfo = $isNewPayment ? 'Created' : 'Updated';
            $infoPay = "Payment - KSH " . number_format($request->amount) . " " . $flashInfo . "!";
            $type    = $isNewPayment ? 'payments' : 'update';
        } else {
            $infoPay = 'No Payments!';
            $type = 'info';
        }

        // Process Welfare Payments (Welfare In)
        if ($request->expin_amount != null) {
            $welfareIn = Welfare::firstOrNew([
                'user_id'   => auth()->id(),
                'cycle_id'  => $cycle->id,
                'member_id' => $request->member_id,
                'type'      => 1  // 1 for Welfare In
            ]);

            // Determine if the welfare in is new or existing
            $isNewWelfareIn = !$welfareIn->exists;

            // Fill or update attributes
            $welfareIn->fill([
                'payment' => $request->expin_amount
            ]);

            // Save the welfare in payment
            $welfareIn->save();

            //message
            $flashInfo = $isNewWelfareIn ? 'Created' : 'Updated';
            $welfareInfo = "Welfare In - KSH " . number_format($request->expin_amount) . " " . $flashInfo . "!";
        } else {
            $welfareInfo = 'No Paid Welfare!';
        }

        // Process Welfare Owed (Welfare Out)
        if ($request->expowe_amount != null) {
            $welfareOwed = Welfare::firstOrNew([
                'user_id'   => auth()->id(),
                'cycle_id'  => $cycle->id,
                'member_id' => $request->member_id,
                'type'      => 0  // 0 for Welfare Owed
            ]);

            // Determine if the welfare Owed is new or existing
            $isNewWelfareOwed = !$welfareOwed->exists;

            // Fill or update attributes
            $welfareOwed->fill([
                'payment' => $request->expowe_amount
            ]);

            // Save the welfare owed
            $welfareOwed->save();

            //message
            $flashInfo = $isNewWelfareOwed ? 'Created' : 'Updated';
            $welfareOwedInfo = "Welfare Owed - KSH " . number_format($request->expowe_amount) . " " . $flashInfo ."!";
        } else {
            $welfareOwedInfo = 'No Owed Welfares!';
        }

        // Optional: Return or log info about both welfare transactions
        $infoWel = $welfareInfo . " : ". $welfareOwedInfo;
        $message = "$name - $infoPay : $infoWel";

        // Return the response as JSON
        return response()->json([
            'name'                  => $request->amount ? $payment->payment : 0,
            'id'                    => $request->amount ? $payment->id : 0,
            'message'               => $message,
            'type'                  => $type,
        ]);
    }

    // IMPORT PAYMENTS LEDGER EXCEL SHEET 
    public function getPaymentsMainInfo(Request $request, $month, $year)
    {
        // Validate the Excel file
        $request->validate(
            [
                'excel'          => 'required|mimes:xlsx, csv, xls|max:10240'
            ],
            [
                'excel.required' => 'File Ledger is required!',
                'excel.mimes'    => 'Wrong File Format, Upload an excelsheet!',
                'excel.max'      => 'This file is to big too be uploaded!',
            ]
        );

        // request to update setting
        $setting    = Setting::orderBy('created_at', 'desc')->first();
 
        // Read the file
        $collection = Excel::toCollection(new MembersImport, $request->file('excel'))[0];

        // confirm names on the spreadsheet against the ones in the DB
        $existingMembers = $this->nameCheck($collection);

        // Count existing members
        $existingCount = $existingMembers->count();

        // Get the list of new members by finding the difference between the sheet and existing members
        $existingNames = $existingMembers->pluck('name');

        // Get the new members by finding the difference between the sheet and existing members
        // $newMembersCollection = $collection->filter(function ($row, $index) use ($existingNames) {
        //     return !$existingNames->contains($row[1]) && strtolower($row[1]) !== 'totals';  // Exclude rows with "totals"
        // });

        // Get the new members by finding the difference between the sheet and existing members
        $newMembersCollection = $collection->filter(function ($row, $index) use ($existingNames) {
            // Check if 'members_name' exists and is not 'TOTALS'
            $name = $row[1];
            // Sanitize the name
            $name = $this->sanitizeName($name);

            return (!$existingNames->contains($name)) && strtolower(empty($name)) !== 'totals'; // Exclude rows with "totals"
        });

        // Create the new_members array with id and name in the same format as existing_members
        $newMembers = [];
        foreach ($newMembersCollection as $index => $row) {
            if (!is_null($row[1])) {
                $newMembers[] = [
                    'id'                    => $index,      // ID (index) in the Excel sheet
                    'name'                  => $row[1] ?? '',      // Name in the second column
                    'telephone'             => $row[2] ?? '00',       // Telephone in the third column
                    'amount_before'         => $row[3] ?? '0',       // Amount before in the fourth column
                    'welfare_before'        => $row[4] ?? '0',       // Welfare before in the fifth column
                    'welfareowed_before'    => $row[5] ?? '0',         // welfareowed_before in the sixth column
                    'active'                => true,
                    'exists'                => false,
                ];
            }
        }

        // Count new members
        $newCount = count($newMembers);

        // if existing members 
        if ($existingCount > 0) {
            $exist = true;
        } else {
            $exist = false;
        }

        // Return the data (existing count, new count, list of existing members with id and name, and new members)
        $newExistingMembers = $existingMembers->map(function ($member) {
            return [
                'id'                    => $member->id,
                'name'                  => $member->name,
                'telephone'             => $member->telephone,
                'total_in'              => $member->total_in,
                'amount_before'         => $member->amount_before,
                'welfare_before'        => $member->welfare_before,
                'welfareowed_before'    => $member->welfareowed_before,
                'active'                => $member->active,
                'exists'                => true,  // Existing members exist
            ];
        })->toArray();

        // Merge both arrays into a single 'all_members' array
        $allMembers = array_merge($newExistingMembers, $newMembers);

        // Load the Excel sheet
        $data = Excel::toCollection(new NewPaymentsImport, $request->file('excel'))[0];

        // Remove irrelevant rows and process data (e.g., 'totals' row)
        $data = $data->filter(function ($row) {
            // Check if 'members_name' exists and is not 'TOTALS'
            $membersName = !empty($row['members_name']) ? $row['members_name'] : $row['name'];
            return $membersName !== 'TOTALS';  // Filter out rows where members name is 'TOTALS'
        });

        // Extract each member and their contributions per month
        $memberContributions = $data->map(function ($row) {
            return [
                'name'                      => !empty($row['members_name']) ? $row['members_name'] : $row['name'],
                'contributions'             => $row['contributions'],
                'welfare_in'                => $row['welfare_in'],
                'welfare_owing'             => $row['welfare_owing'],
            ];
        });

        // List of valid months in uppercase
        $validMonths = array_map('strtoupper', [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ]);

        // Ensure the month is valid and initialize the array
        if (!in_array(strtoupper($month), $validMonths)) {
            throw new Exception("Invalid month: $month");
        }

        $month = strtoupper($month);  // Ensure month is in uppercase
        $monthlyEntries = [$month => []];

        // Helper function for processing contributions and expenses
        function processInfo($row, $amountKey, $welfareInKey, $welfareOweKey, $member, $cycle)
        {
            $amount                 = $row[$amountKey] ?? null;
            $welfare_in_amount      = $row[$welfareInKey] ?? null;
            $welfare_owe_amount     = $row[$welfareOweKey] ?? null;

            if ($member) {
                return [
                    'name'              => !empty($row['members_name']) ? $row['members_name'] : $row['name'],
                    'amount'            => $amount,
                    'expin_amount'      => $welfare_in_amount,
                    'expowe_amount'     => $welfare_owe_amount,
                    'cycle_id'          => $cycle ? $cycle->id : '0',
                    'member_id'         => $member->id,
                ];
            }

            return null;
        }

        // check if Cycle exists 
        $cycle  = Cycle::where([['month', $month], ['year', $year]])->first();

        // Loop through each member and their contributions/expenses
        foreach ($data as $row) {
            $name = !empty($row['members_name']) ? $row['members_name'] : $row['name'];
            $member = Member::where('name', $name)->first();

            // Process contributions (monthlyContributions)
            $contributions = processInfo($row, 'contributions', 'welfare_in', 'welfare_owing', $member, $cycle);
            if ($contributions) {
                $monthlyEntries[$month][] = $contributions;
            }
        }

        // Initialize a counts
        $paysNo     = 0;
        $expInNo    = 0;
        $expOweNo   = 0;

        // Initialize a variable to store the total sum of amounts
        $totalPays  = 0;
        $totalIn    = 0;
        $totalOwe   = 0;

        // Loop through the monthly entries to count members
        foreach ($monthlyEntries[$month] as $entry) {
            if ($entry['amount'] != 0) {
                $paysNo++;
            }

            if ($entry['expin_amount'] != 0) {
                $expInNo++;
            }

            if ($entry['expowe_amount'] != 0) {
                $expOweNo++;
            }

            $totalPays += $entry['amount'] > 0 ? $entry['amount'] : 0;
            $totalIn += $entry['expin_amount'] > 0 ? $entry['expin_amount'] : 0;
            $totalOwe += $entry['expowe_amount'] > 0 ? $entry['expowe_amount'] : 0;
        }

        // Return the response as JSON
        return response()->json([
            'existing_count'        => $existingCount,
            'new_count'             => $newCount,
            'existing_members'      => $newExistingMembers,
            'new_members'           => $newMembers,
            'all_members'           => $allMembers,
            'exist'                 => $exist,
            'member_contributions'  => $memberContributions,
            'monthly_contributions' => $monthlyEntries,
            'months_count'          => $paysNo,
            'monthsexpin_no'        => $expInNo,
            'monthsexpowe_no'       => $expOweNo,
            'total_pay'             => $totalPays,
            'total_in'              => $totalIn,
            'total_owe'             => $totalOwe,
        ]);
    }

    public function nameCheck($collection)
    {
        // Get the names of members from the sheet (assume they are in the second column, i.e., $row[1])
        $memberNames = $collection->pluck(1)->filter(function ($name) {
            return !is_null($name) && strtolower($name) !== 'TOTALS'; // Exclude rows with "totals"
        });

        // Normalize the names by trimming, converting to lowercase, and removing unnecessary characters
        $normalizedMemberNames = $memberNames->map(function ($name) {
            return Str::of($name)
                ->trim()                 // Trim spaces
                ->lower()                // Convert to lowercase
                ->replace('.', '')       // Remove full stops
                ->replace(',', '')       // Remove commas (if needed)
                ->replace('  ', ' ');    // Handle multiple spaces
        });

        // Fetch existing members from the database
        // $this->normalizeMemberNamesFinal();

        $existingMembers = Member::get()->filter(function ($member) use ($normalizedMemberNames) {
            $normalizedDBName = Str::of($member->name)
                ->trim()                 // Trim spaces
                ->lower()                // Convert to lowercase
                ->replace('.', '')       // Remove full stops
                ->replace(',', '')       // Remove commas (if needed)
                ->replace('  ', ' ');    // Handle multiple spaces

            return $normalizedMemberNames->contains($normalizedDBName);
        })->values();

        return $existingMembers;
    }

    public function nameCheck2024($collection)
    {
        // Get the names of members from the sheet (assume they are in the second column, i.e., $row[1])
        $memberNames = $collection->pluck('members_name');

        // Normalize the names by trimming, converting to lowercase, and removing unnecessary characters
        $normalizedMemberNames = $memberNames->map(function ($name) {
            return $this->sanitizeName($name);    // Handle multiple spaces
        });

        // Fetch existing members from the database
        // $this->normalizeMemberNamesFinal();

        $existingMembers = Member::get()->filter(function ($member) use ($normalizedMemberNames) {
            $normalizedDBName = $this->sanitizeName($member->name);

            return $normalizedMemberNames->contains($normalizedDBName);
        })->values();

        return $existingMembers;
    }

    function sanitizeName($name)
    {
        return Str::of($name)
            ->trim()                 // Trim spaces
            ->lower()                // Convert to lowercase
            ->replace('.', '')       // Remove full stops
            ->replace(',', '')       // Remove commas (if needed)
            ->replace('  ', ' ')     // Handle multiple spaces
            ->title();
    }

    function normalizeMemberNamesFinal()
    {
        // Fetch all members
        $members = Member::all();

        // Loop through each member and normalize the name
        foreach ($members as $member) {
            // Normalize the name by trimming, converting to lowercase, and removing unnecessary characters
            $normalizedName = Str::of($member->name)
                ->trim()                 // Trim spaces
                ->lower()                // Convert to lowercase
                ->replace('.', '')       // Remove full stops
                ->replace(',', '')       // Remove commas
                ->replace('  ', ' ')     // Handle multiple spaces
                ->title();               // Capitalize the first letter of each word

            // Only update the name if the normalized name is different from the current name
            if ($normalizedName != $member->name) {
                // Update the member name in the database
                $member->name = $normalizedName;
                $member->save();
            }
        }

        return "Member names normalized and capitalized successfully.";
    }

    // UPDATE CYCLES 
    public function updateCycleInfo(Cycle $cycle)
    {
        $total         = $cycle->payments_total + $cycle->welfares_total;
        $payments      = Payment::where('cycle_id', $cycle->id)->count();
        $activeMembers = Member::where('active', 1)->count();

        if ($payments >= $activeMembers) {
            $done       = 1;
        } else {
            $done       = 0;
        }

        if ($total == 0) {
            $percent = 0;
        } else {
            $percent        = number_format(
                ($cycle->payments_total / $total) * 100
            );
        } 

        // if ($total) {
        //     $percent = 100 - number_format(($cycle->payments_total / $total) * 100);
        // } else {
        //     $percent = 0;
        // }

        // update cycle
        Cycle::where('id', $cycle->id)
            ->update([
                'percent'       => $percent,
                'completed'     => $done,
                'members_no'    => $payments,
                'total'         => $total
            ]);

        // update finances
        $this->UpdateAll();

        // Set the appropriate message based on whether the cycle was newly created or updated
        $m = strtolower($cycle->month);
        $message = 'Cycle '.ucfirst($m) . ' '. $cycle->year .' Finances Updated';
        $type    = 'payments';

        return [$message, $type];
    }

    // UPDATE FINANCES 
    public function UpdateAll()
    {
        // update cycle & finances
        $update = new FinancesController();
        $update->update();
    }

    public function presetMembers()
    {
        // Define the file path in the storage directory
        $filePath = 'spreadsheets/PRESET MEMBERS(SEPT 2024).xlsx';

        // Check if the file exists
        if (Storage::exists($filePath)) {
            // Return a response to download the file
            return Storage::download($filePath, 'PRESET MEMBERS(SEPT 2024).xlsx');
        } else {
            // Handle the case where the file doesn't exist
            return response()->json(['error' => 'File not found.'], 404);
        }
    }

    public function presetLedgers()
    {
        // Define the file path in the storage directory
        $filePath = 'spreadsheets/PRESET LEDGERS(SEPT 2024).xlsx';

        // Check if the file exists
        if (Storage::exists($filePath)) {
            // Return a response to download the file
            return Storage::download($filePath, 'PRESET LEDGERS(SEPT 2024).xlsx');
        } else {
            // Handle the case where the file doesn't exist
            return response()->json(['error' => 'File not found.'], 404);
        }
    }
}
