<?php

namespace App\Exports;

use App\Models\Cycle;
use App\Models\Member;

use App\Models\Payment;
use App\Models\Welfare;

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
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithProperties;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;

class MemberSingle implements FromView, WithEvents, WithColumnWidths, WithStyles, WithProperties, ShouldAutoSize, WithColumnFormatting
{
    private $member;

    public function __construct($member)
    {
        $this->member = $member;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class   => function (AfterSheet $event) {

                $counts = DB::table('cycles')->where('deleted_at', null)->count();


                // columns are 4 from a - e 
                $startCol = 'A';
                $endCol   = 'Z';

                //get rows
                $rowBody  = $counts + 2;
                $rowTotal = $counts + 4;

                $rowEndTotal    = $counts + 4;
                $rowEndBody     = $counts + 2;

                $startBody      = $startCol . '2';

                $endBody        = $endCol . $rowEndBody;

                $startTotal     = 'A' . $rowTotal;

                $endTotal       = 'Z' . $rowEndTotal;

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
        // sheet rows 
        $sheet->getColumnDimension('A')->setAutoSize(true)->setVisible(true)->setCollapsed(false);
        $sheet->getColumnDimension('B')->setAutoSize(false)->setVisible(true)->setCollapsed(false)->setWidth(20);
        $sheet->getColumnDimension('C')->setAutoSize(false)->setVisible(true)->setCollapsed(false)->setWidth(15);
        $sheet->getColumnDimension('D')->setAutoSize(false)->setVisible(true)->setCollapsed(false)->setWidth(15);
        $sheet->getColumnDimension('E')->setAutoSize(false)->setVisible(true)->setCollapsed(false)->setWidth(15);
        $sheet->getColumnDimension('F')->setAutoSize(false)->setVisible(true)->setCollapsed(false)->setWidth(15);

        // get table headers
        $sheet->setCellValue("A1",  "ID.");
        $sheet->setCellValue("B1",  "Pay Cycle");
        $sheet->setCellValue("C1",  "Payments");
        $sheet->setCellValue("D1",  "T. Welfare");
        $sheet->setCellValue("E1",  "Welfare Owed");
        $sheet->setCellValue("F1",  "T. Amounts");

        // get info 
        // $mem    = DB::table('members')->where('id', $this->member->id)->first();
        $rows   = DB::table('cycles')->orderBy('cycle_id', 'desc')->get();

        $numOfRows = $rows->count();
        $num       = $numOfRows + 2;
        $sumRow    = $numOfRows + 4;

        // before values 
        $before_am = $this->member->amount_before;

        $before_wm = $this->member->welfare_before;

        $before_om = $this->member->welfareowed_before;

        $sheet->setCellValue("A2",  "");
        $sheet->setCellValue("B2",  "VALUES BEFORE");
        $sheet->setCellValue("C2",  "$before_am");
        $sheet->setCellValue("D2",  "$before_wm");
        $sheet->setCellValue("E2",  "$before_om");
        $sheet->setCellValue("F2",  "=(SUM(C2:D2) - E2)");

        $sheet->setCellValue("B{$sumRow}",  "TOTAL");

        foreach ($rows as $index => $row) {
            // new row 
            $newRow = $index + 3;

            $sheet->setCellValue("A{$newRow}",  "$row->id");
            $sheet->setCellValue("B{$newRow}",  "$row->name");

            // payment 
            $payment = Payment::where('cycle_id', $row->id)
                            ->where('member_id', $this->member->id)
                            ->sum('payment');

            if ($payment > 0) {
                $sheet->setCellValue("C{$newRow}",  "$payment");
            } else  {
                $new = '0';
                $sheet->setCellValue("C{$newRow}",  "$new");

                $sheet->getColumnDimension('C')->setCollapsed(false)->setVisible('C')->setWidth(15);
            }

            // welfare in 
            $welfare = Welfare::where('cycle_id', $row->id)
                            ->where('member_id', $this->member->id)
                            ->where('type', 1)
                            ->sum('payment');

            if ($welfare > 0) {
                $welfare = number_format($welfare);
                $sheet->setCellValue("D{$newRow}",  "$welfare");
            } else  {
                $new = '0';
                $sheet->setCellValue("D{$newRow}",  "$new");
            }

            // welfare owed 
            $welfare = Welfare::where('cycle_id', $row->id)
                            ->where('member_id', $this->member->id)
                            ->where('type', 0)
                            ->sum('payment');

            if ($welfare > 0) {
                $sheet->setCellValue("E{$newRow}",  "$welfare");
            } else  {
                $new = '0';
                $sheet->setCellValue("E{$newRow}",  "$new");
            }

            // total
            $sheet->setCellValue("F{$newRow}", "=(SUM(C{$newRow}:D{$newRow}) - E{$newRow})");
        }

        // Add cell with SUM & AVERAGE formula to TOTALS SECTION
        // totals row
        $sheet->setCellValue("C{$sumRow}", "=SUM(C2:C{$num})");
        $sheet->setCellValue("D{$sumRow}", "=SUM(D2:D{$num})");
        $sheet->setCellValue("E{$sumRow}", "=SUM(E2:E{$num})");
        $sheet->setCellValue("F{$sumRow}", "=SUM(F2:F{$num})");
    }

    public function columnWidths(): array
    {
        return [
            'A' => 3,
            'B' => 30,
            'C' => 15,
            'D' => 15,
            'E' => 15,
            'F' => 15,
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
            'F' => NumberFormat::FORMAT_NUMBER_00,
            'F' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
        ];
    }
    public function properties(): array
    {
        return [
            'creator'        => Auth::user()->name,
            'title'          => 'View '. $this->member->name . ' Payments and Welfare Records',
            'description'    => 'Use this sheet to add view individual members to the group',
            'subject'        =>  $this->member->name . ' :Member Contributions and Welfares',
            'company'        => Env('APP_NAME'),
        ];
    }

    public function view(): View
    {
        return view('exports.member_single');
    }
}
