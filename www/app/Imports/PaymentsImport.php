<?php

namespace App\Imports;

use App\Models\Cycle;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithStartRow;

class PaymentsImport implements ToCollection, WithStartRow, WithCalculatedFormulas
{
    public function startRow(): int
    {
        return 2;
    }

    // public function model(array $row)
    // {
    //     $id     = Auth::user()->id;

    //     $cycle  = Cycle::orderBy('created_at', 'desc')
    //                     ->first();

    //     return new Payment([
    //         'user_id'       => $id,
    //         'cycle_id'      => $cycle->id,
    //         'member_id'     => $row[1],
    //         'name'          => $row[2],
    //         'payment'       => $row[3],
    //     ]);
    // }

    public function collection(Collection $rows)
    {
        $id     = Auth::user()->id;

        $cycle  = Cycle::orderBy('created_at', 'desc')
                        ->first();

        
        // return $rows;

        foreach ($rows as $row) {
            Payment::create([
                'user_id'       => $id,
                'cycle_id'      => $cycle->id,
                'member_id'     => $row[1],
                'payment'       => $row[1],
            ]);
        }
    }
}
