<?php

namespace App\Exports;

use App\Models\Cycle;
use App\Models\Member;

use App\Models\Payment;
use App\Models\Setting;
use App\Models\Welfare;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\View\View;
use App\Exports\Helpers\ExcelStyles;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithProperties;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;

class CyclesTemplateModal implements FromView, WithEvents, WithColumnWidths, WithStyles, WithProperties, ShouldAutoSize, WithColumnFormatting
{
    public function __construct()
    {

    }

    public function getMembers() : array 
    {
        $members       = DB::table('members')->where('deleted_at', null)->get();

        // $members       = Member::get();

        return [$members, $members->count()];
    }

    public function registerEvents(): array
    {   
        return [
            AfterSheet::class   => function (AfterSheet $event) {
                // get members count 
                $info     = $this->getMembers();
                $counts   = $info[1];  

                // columns are 5 from a - e 
                $startCol = 'A';
                $endCol   = 'E';  

                //get rows
                $rowBody  = $counts + 1;
                $rowTotal = $counts + 2;

                $rowEndTotal    = $counts + 2;
                $rowEndBody     = $counts + 1;

                $startBody      = $startCol . '2';

                $endBody        = $endCol . $rowEndBody;

                $startTotal     = 'A' . $rowTotal;

                $endTotal       = 'E' . $rowEndTotal;

                $rangeBody      = $startBody . ':' . $endBody;
                $rangeTotal     = $startTotal . ':' . $endTotal;

                $rangeId        = 'A2:A' . $rowBody;

                // Get styles
                $styles = ExcelStyles::getExcelStyles();

                $cellRange0 = $rangeId;      // id
                $cellRange1 = 'A1:Z1';       // header
                $cellRange2 = $rangeBody;    // body
                $cellRangeT = $rangeTotal;   // totals

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
        $settings  = Setting::first();

        // get members & count 
        $info      = $this->getMembers();
        $rows      = $info[0];
        $numOfRows = $info[1];  

        $num       = $numOfRows + 1;
        $sumRow    = $numOfRows + 2;

        $welf      = $settings->welfare_def;

        foreach ($rows as $index => $row) {
            // get members row 
            $newRow = $index + 2;

            // set values 
            $sheet->setCellValue("A{$newRow}",  "$row->id");
            $sheet->setCellValue("B{$newRow}",  "$row->name");
            $sheet->setCellValue("E{$newRow}", "=ABS(D{$newRow} - $welf)");

            // $allWelfs = $row->welfare_total;
            // $totals   = $row->welfare_total;
            // $sheet->setCellValue("F{$newRow}", "$allWelfs");
            // // new total welfares 
            // $sheet->setCellValue("G{$newRow}", "=SUM(D{$newRow},F{$newRow})");
            // // new total contributed
            // $sheet->setCellValue("H{$newRow}", "=SUM(G{$newRow},C{$newRow})");
        }

        // Add cell with SUM & AVERAGE formula to TOTALS SECTION
        // total contributions 
        $sheet->setCellValue("C{$sumRow}", "=SUM(C2:C{$num})");
        // total welfare in
        $sheet->setCellValue("D{$sumRow}", "=SUM(D2:D{$num})");
        // total welfare owed
        $sheet->setCellValue("E{$sumRow}", "=SUM(E2:E{$num})");
        // // grand total welfares
        // $sheet->setCellValue("F{$sumRow}", "=SUM(F2:F{$num})");

        // // new total welfare in
        // $sheet->setCellValue("G{$sumRow}", "=SUM(G2:G{$num})");
        // // new grand total CONTRIBUTIONS
        // $sheet->setCellValue("H{$sumRow}", "=SUM(H2:H{$num})");
    }

    public function columnWidths(): array
    {
        return [
            'A' => 5,
            'B' => 30,
            'C' => 15,
            'D' => 15,
            'E' => 15,
            // 'F' => 15,
            // 'G' => 15,
            // 'H' => 15,
        ];
    }

    public function columnFormats(): array
    {
        return [
            'C' => NumberFormat::FORMAT_NUMBER_00,
            'C' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'D' => NumberFormat::FORMAT_NUMBER_00,
            'D' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'E' => NumberFormat::FORMAT_NUMBER_00,
            'E' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            // 'F' => NumberFormat::FORMAT_NUMBER_00,
            // 'F' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            // 'G' => NumberFormat::FORMAT_NUMBER_00,
            // 'G' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            // 'H' => NumberFormat::FORMAT_NUMBER_00,
            // 'H' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
        ];
    }

    public function properties(): array
    {
        // get settings 
        $setting = Setting::first();

        return [
            'creator'        => Auth::user()->name,
            'title'          => 'New Cycle Payments and Welfare Records',
            'description'    => 'Use this sheet to add new member payments and welfare records to the group',
            // 'subject'        => 'Subject Performance Breakdown',
            'company'        => $setting->shortname,
        ];
    }

    public function view(): View
    {
        $info        = $this->getMembers();
        $members     = $info[0];

        return view('exports.cycle_template', [
            'members'       =>  $members,
        ]);
    }
}
