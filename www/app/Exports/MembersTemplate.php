<?php

namespace App\Exports;

use App\Models\Cycle;
use App\Models\Member;

use App\Models\Payment;
use Illuminate\Support\Env;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\View\View;
use App\Exports\Helpers\ExcelStyles;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithProperties;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;

class MembersTemplate implements FromView, WithEvents, WithColumnWidths, WithStyles, WithProperties, ShouldAutoSize, WithColumnFormatting
{
    public function __construct()
    {

    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class   => function (AfterSheet $event) {
                $counts = DB::table('members')->where('deleted_at', null)->count();

                // columns are 4 from a - e 
                $startCol = 'A';
                $endCol   = 'G';

                //get rows
                $rowBody  = $counts + 1;
                $rowTotal = $counts + 3;

                $rowEndTotal    = $counts + 3;
                $rowEndBody     = $counts + 1;

                $startBody      = $startCol . '2';

                $endBody        = $endCol . $rowEndBody;

                $startTotal     = 'A' . $rowTotal;

                $endTotal       = 'G' . $rowEndTotal;

                $rangeBody      = $startBody . ':' . $endBody;
                $rangeTotal     = $startTotal . ':' . $endTotal;

                $rangeId        = 'A2:A' . $rowBody;

                // Get styles
                $styles = ExcelStyles::getExcelStyles();

                $cellRange0 = $rangeId;      // id
                $cellRange1 = 'A1:G1';       // header
                $cellRange2 = $rangeBody;    // body
                $cellRangeT = $rangeTotal;   // totals

                // Hide columns from G onwards
                // $event->sheet->getDelegate()->getColumnDimension('G')->setVisible(false)->setCollapsed(true);

                // Alternatively, hide a range of columns from G to the end
                // for ($col = 'H'; $col <= 'X'; $col++) {
                //     $event->sheet->getDelegate()->getColumnDimension($col)->setVisible(false)->setCollapsed(true);
                // }

                $event->sheet->getDelegate()->getStyle($cellRange0)->applyFromArray($styles['idStyle']);
                $event->sheet->getDelegate()->getStyle($cellRange1)->applyFromArray($styles['headerStyle']);
                $event->sheet->getDelegate()->getStyle($cellRange2)->applyFromArray($styles['allStyle']);
                $event->sheet->getDelegate()->getStyle($cellRangeT)->applyFromArray($styles['totalsStyle']);

                $event->sheet->getDelegate()->freezePane('C2'); // freezing here
            },
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // get table headers
        $sheet->setCellValue("A1",  "No");
        $sheet->setCellValue("B1",  "Members Name");
        $sheet->setCellValue("C1",  "Telephone No");
        $sheet->setCellValue("D1",  "Total Contributions B/F");
        $sheet->setCellValue("E1",  "Welfare B/F");
        $sheet->setCellValue("F1",  "Welfare Owed B/F");
        $sheet->setCellValue("G1",  "Welfare Owed May");

        $sheet->getColumnDimension('A')->setCollapsed(false)->setVisible(true)->setWidth(5);
        $sheet->getColumnDimension('B')->setCollapsed(false)->setVisible(true)->setWidth(30);
        $sheet->getColumnDimension('C')->setCollapsed(false)->setVisible(true)->setWidth(15);
        $sheet->getColumnDimension('D')->setCollapsed(false)->setVisible(true)->setWidth(15);
        $sheet->getColumnDimension('E')->setCollapsed(false)->setVisible(true)->setWidth(15);
        $sheet->getColumnDimension('F')->setCollapsed(false)->setVisible(true)->setWidth(15);
        $sheet->getColumnDimension('G')->setCollapsed(false)->setVisible(true)->setWidth(15);

        // get all members 
        $rows   = Member::where('deleted_at', null)->get();

        $numOfRows = $rows->count();
        $num       = $numOfRows + 1;
        $sumRow    = $numOfRows + 3;

        foreach ($rows as $index => $row) {
            // new row 
            $newRow = $index + 2;

            $sheet->setCellValue("A{$newRow}",  "$row->id");
            $sheet->setCellValue("B{$newRow}",  "$row->name");

            // telephone 
            if ($row->telephone != '') {
                $telephone = $row->telephone;
                $sheet->setCellValue("C{$newRow}",  "$telephone");
            }

            $sheet->setCellValue("D{$newRow}",  "$row->amount_before");
            $sheet->setCellValue("E{$newRow}",  "$row->welfare_before");

            // owed 
            if ($row->welfareowed_before != '') {
                $owed = '0';
                $sheet->setCellValue("F{$newRow}",  "$owed");
            } else {
                $sheet->setCellValue("F{$newRow}",  "$row->welfareowed_before");
            }

            // owed after may
            if ($row->welfare_owing_may != '') {
                $owed = '0';
                $sheet->setCellValue("F{$newRow}",  "$owed");
            } else {
                $sheet->setCellValue("F{$newRow}",  "$row->welfare_owing_may");
            }
        }
    }

    public function columnWidths(): array
    {
        return [
            'A' => 5,
            'B' => 30,
            'C' => 20,
            'D' => 20,
            'E' => 20,
            'F' => 20,
            'G' => 20,
        ];
    }

    public function columnFormats(): array
    {
        return [
            'D' => NumberFormat::FORMAT_NUMBER_00,
            'D' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'E' => NumberFormat::FORMAT_NUMBER_00,
            'E' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'F' => NumberFormat::FORMAT_NUMBER_00,
            'F' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'G' => NumberFormat::FORMAT_NUMBER_00,
            'G' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
        ];
    }

    public function properties(): array
    {
        return [
            'creator'        => Auth::user()->name,
            'title'          => 'Add new members',
            'description'    => 'Use this sheet to add new members to the group',
            // 'subject'        => 'Subject Performance Breakdown',
            'company'        => Env('APP_NAME'),
        ];
    }

    public function view(): View
    {
        return view('exports.members_template');
    }
}
