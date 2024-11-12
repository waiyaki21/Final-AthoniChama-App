<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;

class NewMembersPayments2024 implements ToCollection, WithHeadingRow, WithCalculatedFormulas
{
    public function collection(Collection $collection)
    {
        return $collection;
    }
}
