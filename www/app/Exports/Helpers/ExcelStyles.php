<?php

namespace App\Exports\Helpers; // Adjust the namespace according to your directory structure

use PhpOffice\PhpSpreadsheet\Style\Alignment;

class ExcelStyles
{
    public static function getExcelStyles()
    {
        return [
            'allStyle' => [
                'font' => [
                    'name' => 'Calibri',
                    'color' => ['rgb' => '000000'],
                    'size' => 11,
                ]
            ],
            'headerStyle' => [
                'font' => [
                    'name' => 'Calibri',
                    'size' => 11,
                    'underline' => true,
                    'bold' => true,
                    'alignment' => [
                        'horizontal' => 'right',
                        'wrapText' => true,
                    ]
                ]
            ],
            'idStyle' => [
                'font' => [
                    'name' => 'Calibri',
                    'size' => 11,
                    'underline' => false,
                    'bold' => true,
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_LEFT
                    ]
                ]
            ],
            'highlightStyle' => [
                'font' => [
                    'name' => 'Calibri',
                    'color' => ['rgb' => '002060'],
                    'size' => 11,
                ]
            ],
            'totalsStyle' => [
                'font' => [
                    'name' => 'Calibri',
                    'size' => 12,
                    'bold' => false,
                    'underline' => true,
                ]
            ],
        ];
    }
}
