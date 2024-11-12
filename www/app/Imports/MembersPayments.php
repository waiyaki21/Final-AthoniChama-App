<?php

namespace App\Imports;

use App\Models\Cycle;
use App\Models\Member;
use App\Models\Payment;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class MembersPayments implements ToCollection, WithStartRow, WithValidation
{
    public function startRow(): int
    {
        return 1;
    }

    public function rules(): array
    {
        return [
            '0' => 'required|string',
            '1' => 'required|string',
            '2' => 'required|string',
            '3' => 'required|string',
            // so on
        ];
    }

    public function collection(Collection $rows)
    {
        $id     = Auth::user()->id;

        foreach ($rows as $row) {
            Member::firstOrCreate([
                'user_id'       => $id,
                'name'          => $row[1],
                'telephone'     => $row[2],
                'amount_before' => $row[3],
                'welfare_before' => $row[4],
            ]);
        }
    }
}
