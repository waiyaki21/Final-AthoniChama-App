<?php

namespace App\Imports;

use App\Models\Cycle;
use App\Models\Member;
use App\Models\Payment;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class LedgersVerification implements ToCollection, WithStartRow, WithValidation, WithHeadingRow
{
    private $startRow;

    public function __construct(int $startRow)
    {
        $this->startRow = $startRow;
    }

    public function startRow(): int
    {
        return $this->startRow;
    }

    public function rules(): array
    {
        return [
            'no'                            => 'required',
            'members_name'                  => 'required',
            'total_contributions_bf'        => 'required',
            'total_contributions'           => 'required',
            'total_welfare'                 => 'required',
            'welfare_owing'                 => 'required',
            'total_investment'              => 'required'
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
