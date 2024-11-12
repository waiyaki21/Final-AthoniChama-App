<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Payment;
use App\Models\Welfare;
use Illuminate\Http\Request;
use App\Imports\LedgerImport;
use App\Imports\MembersImport;
use App\Imports\MembersPayments;
use Illuminate\Support\Facades\DB;
use App\Imports\NewMembersPayments;
use App\Notifications\UploadLedger;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\HeadingRowImport;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Notification;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExcelUploads\LedgersExcelController;

class LedgersController extends Controller
{   
    public function index()
    {
        $info = new DashboardController();
        $cycles = $info->CyclesInfo();

        return Inertia::render('Ledgers', [
            'info'   => $cycles
        ]);
    }

    public function uploadTemplates() 
    {
        $path = public_path('excelSheets');
        $files = scandir($path, SCANDIR_SORT_DESCENDING);

        foreach ($files as $file) {
            // file year 
            if ($file == '2024sheet.xlsx') {
                $year = 2024;
            }
            if ($file == '2023sheet.xlsx') {
                $year = 2023;
            }

            // upload excel
            $collection  = Excel::toCollection(new MembersImport, public_path('excelSheets') . '/' . $file);
            $collection2 = Excel::toCollection(new MembersPayments, public_path('excelSheets') . '/' . $file);

            // sort the collection
            $rows       = $collection[0];
            $filtered   = $rows->where(['0', null]);
            $new        = $filtered->all();

            // upload all info array
            $setup      = new LedgersExcelController();

            $members = $setup->memberArray($new);

            $setup->paysArray($collection2, $collection, $year);

            $user = User::where('id', auth()->id())->first();
            Notification::send($user, new UploadLedger($year));
        }
    }

    public function getTemplates()
    {
        // store the public path
        $path = public_path('excelSheets');
        $files = scandir($path, SCANDIR_SORT_DESCENDING);

        // foreach ($files as $index => $file) {
        $first          = $files[0];
        $download_path  = public_path('excelSheets') . '/' . $first;
        return response()->download($download_path); 
    }

    public function storeCyclesLedger(Request $request)
    {
        // upload excel
        $array      = Excel::import(new LedgerImport, $request->file('excel'), \Maatwebsite\Excel\Excel::XLSX);

        $headings   = (new HeadingRowImport)->toArray($request->file('excel'));

        $rows = $array;
        return $rows;

        // Enter the info row by row 
        foreach ($rows  as $row) {
            // if row is not null 
            if ($row[0]  != null) {
                // Contribution Payments 
                if ($row[2]  != null) {
                    $payment      = $row[2];
                    $newpayment   = str_replace(',', '', $payment);

                    Payment::create([
                        'user_id'       => auth()->id(),
                        // 'cycle_id'      => $cycle->id,
                        'member_id'     => $row[0],
                        'payment'       => $newpayment,
                    ]);
                }
                // Welfare Payments 
                if ($row[3]  != null) {
                    $welfare      = $row[3];
                    $newwelfare   = str_replace(',', '', $welfare);

                    Welfare::create([
                        'user_id'       => auth()->id(),
                        // 'cycle_id'      => $cycle->id,
                        'member_id'     => $row[0],
                        'payment'       => $newwelfare,
                        'type'          => 1
                    ]);
                }
                // Welfare Owes 
                if ($row[4]  != null) {
                    $owe      = $row[4];
                    $newowe   = str_replace(',', '', $owe);

                    Welfare::create([
                        'user_id'       => auth()->id(),
                        // 'cycle_id'      => $cycle->id,
                        'member_id'     => $row[0],
                        'payment'       => $newowe,
                        'type'          => 0
                    ]);
                }
            }
        }

        // update all 
        // $this->updateCycle($cycle);

        return back();
    }

    public function ledgerExist($year)
    {
        // Get the current year
        $currentYear = date('Y');

        // Fetch the count of cycles for the given year
        $cycles = DB::table('cycles')
                    ->where('deleted_at', null)
                    ->where('year', $year)
                    ->count();

        // Check if the given year matches the current year
        if ($year == $currentYear) {
            // Handle case for current year
            if ($cycles > 0) {
                $message = 'Ledger: ' . $year . ' (Current Year) Already has (' . $cycles . ') Monthly cycles! All Member Information will be updated!';
                $exist = true;
            } elseif($cycles == 12) {
                $message = 'Ledger: ' . $year . ' (Current Year) is completely Filled! All Member Information will be updated!';
                $exist = false;
            } elseif($cycles == 0) {
                $message = 'Ledger: ' . $year . ' (Current Year) is Empty & Can be filled!';
                $exist = false; 
            }
            $current = true;
        } else {
            // Handle case for other years
            if ($cycles > 0) {
                $message = 'Ledger: ' . $year . ' Already has (' . $cycles . ') Monthly cycles! All Member Information will be updated!';
                $exist = true;
            } elseif ($cycles == 12) {
                $message = 'Ledger: ' . $year . ' is completely filled & Already has (' . $cycles . ') Monthly cycles! All Member Information will be updated!';
                $exist = false;
            } elseif($cycles == 0) {
                $message = 'Ledger: ' . $year . ' is Empty & Can be filled!';
                $exist = false;
            }
            $current = false;
        }

        return [$cycles, $message, $exist, $current];
    }
}
