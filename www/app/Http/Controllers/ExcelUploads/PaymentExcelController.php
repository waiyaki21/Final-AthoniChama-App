<?php

namespace App\Http\Controllers\ExcelUploads;

use Exception;
use Carbon\Carbon;
use App\Models\Cycle;
use App\Models\Member;
use App\Models\Payment;
use App\Models\Welfare;
use App\Http\Controllers\Controller;

class PaymentExcelController extends Controller
{

    public function paysArray($rows, $cycle)
    { 
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
                        'cycle_id'      => $cycle->id,
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
                        'cycle_id'      => $cycle->id,
                        'member_id'     => $row[0],
                        'payment'       => $newwelfare,
                        'type'          => 1
                    ]);
                }
                
                // Welfare Owed 
                if ($row[4]  != '0') {
                    $owe      = $row[4];
                    $newowe   = str_replace(',', '', $owe);

                    Welfare::create([
                        'user_id'       => auth()->id(),
                        'cycle_id'      => $cycle->id,
                        'member_id'     => $row[0],
                        'payment'       => $newowe,
                        'type'          => 0
                    ]);
                }
            }
        }

        $welfares   = Welfare::where('cycle_id', $cycle->id)
                            ->orderBy('created_at', 'desc')
                            ->get();

        $payments   = Payment::where('cycle_id', $cycle->id)
                            ->orderBy('created_at', 'desc')
                            ->get();

        return [$payments, $welfares];
    }
}
