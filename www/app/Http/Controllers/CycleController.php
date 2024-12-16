<?php

namespace App\Http\Controllers;

use Exception;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Cycle;
use App\Models\Member;
use App\Models\Expense;

use App\Models\Payment;
use App\Models\Project;
use App\Models\Setting;
use App\Models\Welfare;
use Illuminate\Support\Str;
use App\Models\CycleExpense;
use Illuminate\Http\Request;
use App\Imports\MembersImport;
use App\Imports\PaymentsImport;
use App\Imports\MembersPayments;
use App\Models\CycleExpenseNames;
use Illuminate\Support\Facades\DB;
use App\Imports\NewMembersPayments;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\FinancesController;
use App\Http\Controllers\ExcelUploads\LedgersExcelController;
use App\Http\Controllers\ExcelUploads\PaymentExcelController;

class CycleController extends Controller
{
    public function index()
    {
        // get & update all cycles 
        $cycles         = Cycle::orderBy('id', 'desc')->get();

        // payment total
        $paySum         = Payment::sum('payment');

        // members total
        $members        = Member::count();

        // payment average
        $totalAvg       = Payment::avg('payment');

        //latest cycle
        $cycle          = Cycle::orderBy('created_at', 'desc')
                                ->first();

        // form data 
        // get cycle form data
        if ($cycles->count() == 0) {
            // get suitable name 
            $date       = Carbon::now()->format('d/m/Y');
            $thisMonth  = Carbon::now()->format('F y');
            $next_name  = $thisMonth;
        } else {
            // get suitable name 
            $date       = Carbon::now()->format('d/m/Y');
            $nextMonth  = Carbon::now()->addMonth()->format('F y');
            $next_name  = $nextMonth;
        }

        // get settings 
        $settings = Setting::first();

        $info = new DashboardController;
        $info = $info->CyclesInfo();

        // update all cycles 
        $this->updateCycles();

        return Inertia::render('Cycles', [
            'name'      => env('APP_NAME'),
            'route'     => Route::current()->getName(),
            'cycles'    => $cycles,
            'date'      => $date,
            'nextname'  => $next_name,
            'paySum'    => $paySum,
            'members'   => $members,
            'avg'       => $totalAvg,
            'cycle'     => $cycle,
            'settings'  => $settings,
            'info'      => $info,
        ]);
    }

    public function store(Request $request)
    {
        // validate
        request()->validate([
                'name'          => 'required|unique:cycles',
                'date'          => 'required',
                'month'         => 'required',
                'year'          => 'required',
                'amount'        => 'required',
                'welfare_amnt'  => 'required',
            ],
            [
                'name.required'         => 'Cycle name is required!',
                'name.unique'           => 'Cycle name is not unique!' .$request->name . ' already exists!',
                'date.required'         => 'Cycle Date is required!',
                'month.required'        => 'Cycle Month is required!',
                'year.required'         => 'Cycle Year is required!',
                'amount.required'       => 'Cycle Amount is required!',
                'welfare_amnt.required' => 'Cycle Welfare Amount is required!',
            ]
        );

        // members total
        $members = DB::table('members')->count();

        // total amnt
        $total = $members * $request->amount;

        // get month & year
        $date  = Carbon::createFromFormat('Y-m-d', $request->date)->format('d-m-Y');

        // create cycle 
        Cycle::create([
            'user_id'       => auth()->id(),
            'name'          => request('name'),
            'date'          => $date,
            'month'         => request('month'),
            'year'          => request('year'),
            'amount'        => request('amount'),
            'welfare_amnt'  => request('welfare_amnt'),
            'members_no'    => $members,
            'total'         => $total,
        ]);

        // update all 
        $cycle = Cycle::orderBy('created_at', 'desc')->first();
        $this->updateCycle($cycle);

        // return 
        return back();
    }

    public function storeExcel(Request $request)
    {
        // $request->validate(
        //     [
        //         'excel'          => 'required|mimes:xlsx, csv, xls|max:10240'
        //     ],
        //     [
        //         'excel.required' => 'File Ledger is required!',
        //         'excel.mimes'    => 'Wrong File Format, Upload an excelsheet!',
        //         'excel.max'      => 'This file is to big too be uploaded!',
        //     ]
        // );

        // get date, month & year
        $date  = Carbon::now();
        $month = Carbon::parse($date)->format('F');
        $year  = Carbon::parse($date)->format('Y');

        $monthNumber = date('n', strtotime($month)); // Convert "January" to 1, "February" to 2, etc.
        $date = Carbon::create($year, $monthNumber)->firstOfMonth()->addDay(1);

        // validate
        request()->validate([
                'name'          => 'required|unique:cycles',
                'date'          => 'required',
                'amount'        => 'required',
                'welfare_amnt'  => 'required',
            ],
            [
                'name.required'         => 'Cycle Name is required!',
                'name.unique'           => 'Cycle Name is not unique!' . $request->name . ' already exists!',
                'date.required'         => 'Cycle Date is required!',
                'amount.required'       => 'Cycle Amount is required!',
                'welfare_amnt.required' => 'Cycle Welfare Amount is required!',
            ]
        );

        // members total
        $members = Member::count();

        // total amnt
        $total = $members * $request->amount;

        // create cycle 
        Cycle::create([
            'user_id'       => auth()->id(),
            'name'          => request('name'),
            'date'          => $date,
            'month'         => $month,
            'year'          => $year,
            'amount'        => request('amount'),
            'welfare_amnt'  => request('welfare_amnt'),
            'members_no'    => $members,
            'total'         => $total,
        ]);

        // get cycle 
        $cycle = Cycle::orderBy('created_at', 'desc')
                        ->first();

        // update all 
        $this->updateCycle($cycle);

        // return back();
        return response()->json([null, 200,  $cycle->id]);
    }

    public function storeCyclesModal(Request $request, $month, $year)
    {
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

        // get settings 
        $setting = Setting::first();
        // get date, month & year
        $monthNumber = date('n', strtotime($month)); // Convert "January" to 1, "February" to 2, etc.
        $date = Carbon::create($year, $monthNumber)->firstOfMonth()->addDay(1);

        // members total
        $members = DB::table('members')->where('deleted_at', null)->count();

        // total amnt
        $total = $members * $request->amount;

        // create cycle 
        $cycle = Cycle::create([
            'user_id'       => auth()->id(),
            'name'          => strtoupper($month . ' ' . $year),
            'date'          => $date,
            'month'         => strtoupper($month),
            'year'          => $year,
            'amount'        => $setting->payment_def,
            'welfare_amnt'  => $setting->welfare_def,
            'members_no'    => $members,
            'total'         => $total,
        ]);

        // upload excel
        $array  = Excel::toCollection(new PaymentsImport, $request->file('excel'));
        $rows   = $array[0];

        // upload all info array 
        $payments   = new PaymentExcelController();
        $info       = $payments->paysArray($rows, $cycle);

        // update all 
        $this->updateCycle($cycle);

        // return back();
        return response()->json([null, 200,  $cycle->id, $info]);
    }

    public function storeSheetCycle(Request $request, Cycle $cycle) 
    {
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

        // upload excel
        $array  = Excel::toCollection(new PaymentsImport, $request->file('excel'));
        $rows   = $array[0];

        // upload all info array
        $payments   = new PaymentExcelController();
        $info       = $payments->paysArray($rows, $cycle);

        // update cycle 
        $this->updateCycle($cycle);

        return response()->json([200, $info[0], $info[1]]);
    }

    public function getLedgerMainInfo(Request $request, $year)
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

        // Get the names of members from the sheet (assume they are in the second column, i.e., $row[1])
        // $memberNames = $collection->pluck(1)->filter();
        $memberNames = $collection->pluck(1)->filter(function ($name) {
            return !is_null($name) && strtolower($name) !== 'TOTALS'; // Exclude rows with "totals"
        });

        // Fetch existing members from the database
        $existingMembers = Member::whereIn('name', $memberNames)
                            ->select('id', 'name', 'telephone', 'amount_before', 'welfare_before', 'welfareowed_before', 'active')
                            ->orderBy('id', 'asc')
                            ->get();

        // Count existing members
        $existingCount = $existingMembers->count();

        // Get the list of new members by finding the difference between the sheet and existing members
        $existingNames = $existingMembers->pluck('name');

        // Get the new members by finding the difference between the sheet and existing members
        $newMembersCollection = $collection->filter(function ($row, $index) use ($existingNames) {
            return !$existingNames->contains($row[1]) && strtolower($row[1]) !== 'totals';  // Exclude rows with "totals"
        });

        // Create the new_members array with id and name in the same format as existing_members
        $newMembers = [];
        foreach ($newMembersCollection as $index => $row) {
            if (!is_null($row[1])) {
                $newMembers[] = [
                    'id'                    => $index,      // ID (index) in the Excel sheet
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

                if ($amount > 0 && $member && $cycle) {  // Check only if amount, member, and cycle exist
                    $payment = Payment::where([
                        ['payment', $amount],
                        ['member_id', $member->id],
                        ['cycle_id', $cycle->id]
                    ])->first();

                    $exists  = $payment ? true : false;
                    $cycleID = $payment ? $cycle->id : '0';
                    $payId   = $payment ? $payment->id : '0';
                    $memID   = $member ? $member->id : '0';

                    $contributions[] = [
                        'name'      => $row['members_name'],
                        'telephone' => $row['telephone_no'],
                        'amount'    => $amount,
                        'exists'    => $exists,
                        'cycle_id'  => $cycleID,
                        'mem_id'    => $memID,
                        'pay_id'    => $payId
                    ];
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

    public function storeCyclesLedgerModal($month, $year)
    {
        // get settings 
        $setting    = Setting::first();
        // get date, month & year
        $monthNumber = date('n', strtotime($month)); // Convert "January" to 1, "February" to 2, etc.
        $date = Carbon::create($year, $monthNumber)->firstOfMonth()->addDay(1);

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
        $message = $isNewCycle ? $cycle->name . ' was created' : $cycle->name . ' was updated';
        $type    = $isNewCycle ? 'success' : 'info';

        // Return the response as JSON
        return response()->json([
            'name'                  => $cycle->name,
            'id'                    => $cycle->id,
            'message'               => $message,
            'type'                  => $type,
        ]);
    }

    public function storeCyclesLedger(Request $request, $year)
    {

        set_time_limit(0);

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

        // get before values 
        $cyclesBefore       = DB::table('cycles')->where('deleted_at',null)->count();
        $membersBefore      = DB::table('members')->where('deleted_at', null)->count();
        $paysBefore         = DB::table('payments')->where('deleted_at', null)->sum('payment');
        $welfaresBefore     = DB::table('welfares')->where('deleted_at', null)->sum('payment');

        // upload excel
        $collection  = Excel::toCollection(new MembersImport, $request->file('excel'));
        $collection2 = Excel::toCollection(new MembersPayments, $request->file('excel'));

        // return $collection;

        // sort the collection
        $rows       = $collection[0];
        $filtered   = $rows->where(['0', null]);
        $new        = $filtered->all();

        // upload all info array
        $setup      = new LedgersExcelController();
        
        $setup->memberArray($new);

        $p = $setup->paysArray($collection2, $collection, $year);

        return $p;

        // $setup->memberWelfarePays($new);

        // get current values 
        $cyclesNow      = DB::table('cycles')->where('deleted_at', null)->count();
        $membersNow     = DB::table('members')->where('deleted_at', null)->count();
        $paysNow        = DB::table('payments')->where('deleted_at', null)->sum('payment');
        $welfaresNow    = DB::table('welfares')->where('deleted_at', null)->sum('payment');

        // get the diffrence 
        $cyclesDiff     = $cyclesNow - $cyclesBefore;
        $membersDiff    = $membersNow - $membersBefore;
        $paysDiff       = $paysNow - $paysBefore;
        $welfaresDiff   = $welfaresNow - $welfaresBefore;

        // create the message 
        $message        = $cyclesDiff . ' Payment Cycles Added, ' . $membersDiff . ' Members Added, KSH ' .$paysDiff. ' contribution payments added , KSH ' . $welfaresDiff . ' welfare payments added';
        // return $welfares;

        return [$message];

        // return response()->json([$cycles]);
    }

    public function show(Cycle $cycle)
    {
        $cycle      = Cycle::where('id', $cycle->id)
                            ->withCount('payments', 'welfares', 'projects')
                            ->first();

        // Get the first cycle based on ID (assuming ID order determines the first)
        $firstCycle = Cycle::orderBy('id')->first();

        // Check if $cycle is the first
        if ($cycle && $firstCycle && $cycle->id === $firstCycle->id) {
            // $cycle is the first among all cycles
            // Perform the logic for the first cycle
            $state = 'Cycle Ongoing';
        } else {
            // $cycle is not the first
            $state = 'Cycle Past';
        }

        // update all 
        $this->updateCycle($cycle);

        $welfs      = Welfare::where('cycle_id', $cycle->id)
                            ->get('member_id');

        $unpaidWel  = Member::whereNotIn('id', $welfs)
                            ->get();

        if($cycle->percent != 100) {
            if ($cycle->payments->count() >= $cycle->members_no) {
                $try = 'Cycle not 100%, all members paid but some incomplete';
                $pays = Payment::where([
                                    ['cycle_id', $cycle->id]
                                ])
                                ->get('member_id');

                $unpaid     = DB::table('members')->where('deleted_at', null)->whereNotIn('id', $pays)
                                ->get();
            } else {
                $try = 'Cycle not 100%, not all members paid';
                $pays       = Payment::where('cycle_id', $cycle->id)
                                ->get('member_id');

                $unpaid     = DB::table('members')->where('deleted_at', null)->whereNotIn('id', $pays)
                                ->get();
            }
        } else {
            $try = 'Cycle is 100%';
            $pays       = Payment::where('cycle_id', $cycle->id)
                            ->get('member_id');

            $unpaid     = DB::table('members')->where('deleted_at', null)->whereNotIn('id', $pays)
                                ->get();
        }

        $unpaidActiveWel  = Member::whereNotIn('id', $welfs)
                            ->where('active', 1)
                            ->count();

        $unpaidActive     = DB::table('members')
                                ->where('deleted_at', null)
                                ->where('active', 1)
                                ->whereNotIn('id', $pays)
                                ->count();

        // return $unpaid;

        return Inertia::render('Payments', [
            'name'      => env('APP_NAME'),
            'route'     => Route::current()->getName(),
            'cycle'     => $cycle,
            'unpaid'    => $unpaid,
            'unpaidWel' => $unpaidWel,
            'state'     => $state,
            'unpaidActive'      => $unpaidActive,
            'unpaidActiveWels'  => $unpaidActiveWel,
        ]);
    }

    public function update(Request $request, Cycle $cycle)
    {
        //validate the request
        $this->validate($request, [
            'name'           => 'required',
            'date'           => 'required',
            'amount'         => 'required',
            'welfare_amnt'   => 'required',
        ]);
        
        $date  = Carbon::createFromFormat('d/m/Y', $request->date)->format('d-m-Y');

        // request to update cycle
        Cycle::where('id', $cycle->id)
            ->update([
                'name'          => request('name'),
                'date'          => $date,
                'amount'        => request('amount'),
                'welfare_amnt'  => request('welfare_amnt')
            ]);

        // update finances
        $updateFinance = new FinancesController();
        $updateFinance->update();

        return back();
    }

    public function destroy(Cycle $cycle)
    {
        // get & delete payments 
        $payments = Payment::where('cycle_id', $cycle->id)
                            ->get();
        foreach ($payments as $payment) {
            $payment->delete();
        }

        // get & delete welfares 
        $welfares = Welfare::where('cycle_id', $cycle->id)
                            ->get();
        foreach ($welfares as $welfare) {
            $welfare->delete();
        }

        // get & delete cycleexpenses 
        $cycleexpneses = CycleExpense::where('cycle_id', $cycle->id)
                            ->get();
        foreach ($cycleexpneses as $cycleexpense) {
            $cycleexpense->delete();
        }

        // get & delete expenses 
        $expneses = Expense::where('cycle_id', $cycle->id)
                            ->get();
        foreach ($expneses as $expense) {
            $expense->delete();
        }

        // get & delete projects 
        $projects = Project::where('cycle_id', $cycle->id)
                            ->get();
        foreach ($projects as $project) {
            $project->delete();
        }

        // delete cycle 
        $cycle->delete();

        // update finances
        $updateFinance = new FinancesController();
        $updateFinance->update();

        return redirect('/cycles');
    }

    public function destroyReload(Cycle $cycle)
    {
        // get & delete payments 
        $payments = Payment::where('cycle_id', $cycle->id)
                            ->get();
        foreach ($payments as $payment) {
            $payment->delete();
        }

        // get & delete welfares 
        $welfares = Welfare::where('cycle_id', $cycle->id)
                            ->get();
        foreach ($welfares as $welfare) {
            $welfare->delete();
        }

        // delete cycle 
        $cycle->delete();

        // update finances
        $updateFinance = new FinancesController();
        $updateFinance->update();

        return redirect('/cycles');
    }

    public function quickDelete($cycle)
    {
        $cycle         = Cycle::where('id', $cycle->id)->orderBy('created_at', 'desc')->first();

        $payments = Payment::where('cycle_id', $cycle->id)
            ->get();
        foreach ($payments as $payment) {
            $payment->delete();
        }

        // get & delete welfares 
        $welfares = Welfare::where('cycle_id', $cycle->id)
                            ->get();
        foreach ($welfares as $welfare) {
            $welfare->delete();
        }

        $this->updateCycle($cycle);
        $cycle         = Cycle::where('id', $cycle->id)->withCount('payments','welfares')->first();
        $cycle->delete();

        $members        = Member::get();

        foreach ($members as $member) {
            $setup      = new MemberController();
            $setup->destroy($member);
        }

        // $members         = Member::get('id');
        return [$cycle];
    }

    public function updateCycles() 
    {
        // get all cycles 
        $cycles = DB::table('cycles')->orderBy('created_at', 'desc')
                        ->where('deleted_at', null)
                        ->get();

        // update each cycle 
        foreach ($cycles as $cycle) {
            $cycle      = Cycle::where('id', $cycle->id)->first();
            $this->updateCycle($cycle);
        }

        // get all cycles 
        $cycles = DB::table('cycles')->orderBy('created_at', 'asc')
                        ->where('deleted_at', null)
                        ->get();

        // return the cycles 
        return $cycles;
    } 

    public function updateCycle(Cycle $cycle)
    {
        $total      = $cycle->payments_total + $cycle->welfares_total;

        $payments   = Payment::where('cycle_id', $cycle->id)->count();

        $activeMembers = Member::where('active', 1)->count();

        if ($payments >= $activeMembers) {
            $done       = 1;
            $percent    = 100;
        } else {
            $done           = 0;
            // $expected       = $activeMembers * $cycle->amount;
            if ($total == 0) {
                $percent = 0;
            } else {
                $percent        = number_format(
                    ($cycle->payments_total / $total) * 100
                );
            } 
        }

        $monthNumber = date('n', strtotime($cycle->month)); // Convert "January" to 1, "February" to 2, etc.
        $date = Carbon::create($cycle->year, $monthNumber)->firstOfMonth()->addDay(1);

        // update cycle
        Cycle::where('id', $cycle->id)
            ->update([
                'percent'       => $percent,
                'completed'     => $done,
                'members_no'    => $payments,
                'total'         => $total,
                'date'          => $date
            ]);

        // update finances
        $updateFinance = new FinancesController();
        $updateFinance->update();
    }

    public function clearBalance(Cycle $cycle , Member $member)
    {
        Payment::where([
            ['cycle_id', $cycle->id],
            ['member_id', $member->id],
            ['payment','!=', $cycle->amount]
        ])
        ->update([
            'payment'   => $cycle->amount
        ]);

        // update cycle 
        $this->updateCycle($cycle);

        // update finances
        $updateFinance = new FinancesController();
        $updateFinance->update();

        $payments   = Payment::where('cycle_id', $cycle->id)
                            ->orderBy('created_at', 'desc')
                            ->with('member:id,name')
                            ->get();

        $cycle      = Cycle::where('cycle_id', $cycle->id)
                            ->first();

        // return [$payments, $cycle];
        return back();
    }

    public function clearAllBalances(Cycle $cycle)
    {
        $pays = Payment::where([
                        ['cycle_id', $cycle->id],
                        ['payment', '!=', $cycle->amount]
                    ])
                        ->get();

        foreach ($pays as $payment) {
            Payment::where('id', $payment->id)
                    ->update([
                        'payment'   => $cycle->amount
                    ]);
        }
        
        // update cycle 
        $this->updateCycle($cycle);

        // update finances
        $updateFinance = new FinancesController();
        $updateFinance->update();

        $payments   = Payment::where('cycle_id', $cycle->id)
            ->orderBy('created_at', 'desc')
            ->with('member:id,name')
            ->get();

        $cycle      = Cycle::where('cycle_id', $cycle->id)
            ->first();

        return [$payments, $cycle];
        // return back();
    }

    // API CALLS 
    public function getCycleInfo(Cycle $cycle)
    {
        // get cycle
        $cycle      = Cycle::where('id', $cycle->id)
                        ->withCount('payments', 'welfares', 'projects', 'cycleExpenses')
                        // ->with('welfares:cycle')
                        ->first();

        $payments   = Payment::where('cycle_id', $cycle->id)
                            ->orderBy('created_at', 'desc')
                            ->with('member:id,name', 'cycle:id,name')
                            ->get();

        $cycle_exps   = CycleExpense::where('cycle_id', $cycle->id)
                            ->orderBy('created_at', 'desc')
                            ->get();

        $welfares   = Welfare::where('cycle_id', $cycle->id)
                            ->orderBy('created_at', 'desc')
                            ->with('member:id,name,welfare_before', 'cycle:id,name')
                            ->get();

        $welfs      = Welfare::where('cycle_id', $cycle->id)
                            ->get('member_id');

        $unpaidWel  = Member::whereNotIn('id', $welfs)
                            ->get();

        $pays       = Payment::where([
                                ['cycle_id', $cycle->id]
                            ])
                            ->get('member_id');

        $unpaid     = DB::table('members')->where('deleted_at', null)->whereNotIn('id', $pays)
                            ->get();

        $unpaidActiveWel  = Member::whereNotIn('id', $welfs)
                            ->where('active', 1)
                            ->count();

        $unpaidActive     = DB::table('members')
                                ->where('deleted_at', null)
                                ->where('active', 1)
                                ->whereNotIn('id', $pays)
                                ->count();

        // Get the first cycle based on ID (assuming ID order determines the first)
        $firstCycle = Cycle::orderBy('id')->first();

        // Check if $cycle is the first
        if ($cycle && $firstCycle && $cycle->id === $firstCycle->id) {
            // $cycle is the first among all cycles
            // Perform the logic for the first cycle
            $state = 'Cycle Ongoing';
        } else {
            // $cycle is not the first
            $state = 'Cycle Past';
        }

        return [$cycle, $payments, $welfares, $unpaid, $unpaidWel, $state, $unpaidActive, $unpaidActiveWel, $cycle_exps];
    }

    public function getCyclesOrder($to, $id)
    {
        $cycles = Cycle::orderBy($to, $id)
            ->get();

        return [$cycles, $id];
    }

    public function getCyclesOrderYear($id)
    {
        $cycles = Cycle::where('year', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return [$cycles, $id];
    }

    public function getCyclesOrderMonth($id)
    {
        $cycles = Cycle::where('month', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return [$cycles, $id];
    }

    public function getPaymentsOrder(Cycle $cycle, $to, $id)
    {
        $payments   = Payment::where('cycle_id', $cycle->id)
                        ->orderBy($to, $id)
                        ->with('member:id,name,amount_before,telephone','cycle:id,name')
                        ->get();

        $cycle      = Cycle::where('id', $cycle->id)
                        ->first();

        return [$payments, $cycle];
    }

    public function getWelfaresIn(Cycle $cycle)
    {
        $welfares   = Welfare::where('cycle_id', $cycle->id)
            ->where('type', 1)
            ->with('member:id,name,welfare_before')
            ->get();

        return [$welfares];
    }

    public function getWelfaresOut(Cycle $cycle)
    {
        $welfares   = Welfare::where('cycle_id', $cycle->id)
            ->where('type', 0)
            ->with('member:id,name,welfare_before')
            ->get();

        return [$welfares];
    }

    public function cycleExist($month, $year)
    {
        $name = strtoupper($month . ' ' . $year);

        $cycles = DB::table('cycles')
                        ->where('deleted_at', null)
                        ->where('name' , $name)
                        ->where('month', strtoupper($month))
                        ->where('year', $year)
                        ->count();

        $cycle = DB::table('cycles')
                        ->where('deleted_at', null)
                        ->where('name' , $name)
                        ->where('month', strtoupper($month))
                        ->where('year', $year)
                        ->get();

        // return $cycle;
        $m = strtolower($month);

        if ($cycles > 0) {
            $message    = 'Cycle '. ucfirst($m) . ' ' . $year . ' - Already Exists, Existing data will be updated!'; 
            $exist      = true;
        } else {
            $message    = 'Cycle '. ucfirst($m) . ' ' . $year . ' - Is Empty & Ready!'; 
            $exist      = false;
        }
        
        return [$cycles, $message, $exist, $cycle];
    }
}
