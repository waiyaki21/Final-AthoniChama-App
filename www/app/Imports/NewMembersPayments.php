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

class NewMembersPayments implements ToCollection, WithHeadingRow
{
    // public function startRow(): int
    // {
    //     return 1;
    // }

    // public function rules(): array
    // {
    //     return [
    //         '0' => 'required|string',
    //         '1' => 'required|string',
    //         '2' => 'required|string',
    //         '3' => 'required|string',
    //         // so on
    //     ];
    // }

    public function collection(Collection $collection)
    {
        return $collection;
    }
}
