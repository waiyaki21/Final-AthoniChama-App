<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class NewPaymentsImport implements ToCollection, WithHeadingRow, WithCalculatedFormulas
{
    public function collection(Collection $collection)
    {
        return $collection;
    }
}
