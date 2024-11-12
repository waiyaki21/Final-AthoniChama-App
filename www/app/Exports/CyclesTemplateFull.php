<?php

namespace App\Exports;

use App\Models\Cycle;
use App\Models\Member;

use App\Models\Payment;
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
use PhpOffice\PhpSpreadsheet\Style\Border;
use App\Http\Controllers\SettingController;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithProperties;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;

class CyclesTemplateFull implements FromView, WithEvents, WithColumnWidths, WithStyles, WithProperties, ShouldAutoSize, WithColumnFormatting
{
    private $year;

    public function __construct($year)
    {
        $this->year = $year;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class   => function (AfterSheet $event) {
                $counts = DB::table('members')->where('deleted_at', null)->count();

                // columns are 4 from a - e 
                $startCol = 'A';
                $endCol   = 'Z';

                //get rows
                $rowBody  = $counts + 1;
                $rowTotal = $counts + 3;

                $rowEndTotal    = $counts + 3;
                $rowEndBody     = $counts + 1;

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
        $sheet->getColumnDimension('E')->setAutoSize(false)->setVisible(true)->setCollapsed(false);
        $sheet->getColumnDimension('F')->setAutoSize(false)->setVisible(true)->setCollapsed(false);
        $sheet->getColumnDimension('G')->setAutoSize(false)->setVisible(true)->setCollapsed(false);
        $sheet->getColumnDimension('H')->setAutoSize(false)->setVisible(true)->setCollapsed(false);
        $sheet->getColumnDimension('I')->setAutoSize(false)->setVisible(true)->setCollapsed(false);
        $sheet->getColumnDimension('J')->setAutoSize(false)->setVisible(true)->setCollapsed(false);
        $sheet->getColumnDimension('K')->setAutoSize(false)->setVisible(true)->setCollapsed(false);
        $sheet->getColumnDimension('L')->setAutoSize(false)->setVisible(true)->setCollapsed(false);
        $sheet->getColumnDimension('M')->setAutoSize(false)->setVisible(true)->setCollapsed(false);
        $sheet->getColumnDimension('N')->setAutoSize(false)->setVisible(true)->setCollapsed(false);
        $sheet->getColumnDimension('O')->setAutoSize(false)->setVisible(true)->setCollapsed(false);
        $sheet->getColumnDimension('P')->setAutoSize(false)->setVisible(true)->setCollapsed(false);

        $rows   = Member::where('deleted_at', null)->get();

        $cycles = DB::table('cycles')
                    ->where('deleted_at', null)
                    ->where('year', $this->year)
                    ->orderBy('created_at','desc')
                    ->get();

        $numOfRows = $rows->count();
        $num       = $numOfRows + 1;
        $sumRow    = $numOfRows + 3;

        foreach ($rows as $index => $row) {
            // new row 
            $newRow = $index + 2;

            $sheet->setCellValue("A{$newRow}",  "$row->id");
            $sheet->setCellValue("B{$newRow}",  "$row->name");
            $sheet->setCellValue("C{$newRow}",  "$row->telephone");
            
            $sheet->setCellValue("D{$newRow}",  "$row->amount_before");

            foreach ($cycles as $indexCycle => $cycle) {
                // rows 
                $new = $indexCycle + 1;
                switch ($new) {
                    case 1:
                        $cycleRow = 'E' . $newRow;
                        $pay = Payment::where('cycle_id', $cycle->id)
                            ->where('member_id', $row->id)
                            ->sum('payment');

                        $cycleName = $cycle->month;
                        $sheet->setCellValue("E1",  "$cycleName");

                        $sheet->setCellValue("$cycleRow",  "$pay");

                        $sheet->setCellValue("E{$sumRow}", "=SUM(E2:E{$num})");

                        $sheet->getColumnDimension('E')->setCollapsed(false)->setVisible(true)->setWidth(11);
                        break;
                    case 2:
                        $cycleRow = 'F' . $newRow;
                        $pay = Payment::where('cycle_id', $cycle->id)
                            ->where('member_id', $row->id)
                            ->sum('payment');

                        $cycleName = $cycle->month;
                        $sheet->setCellValue("F1",  "$cycleName");

                        $sheet->setCellValue("$cycleRow",  "$pay");

                        $sheet->setCellValue("F{$sumRow}", "=SUM(F2:F{$num})");

                        $sheet->getColumnDimension('F')->setCollapsed(false)->setVisible(true)->setWidth(11);
                        break;
                    case 3:
                        $cycleRow = 'G' . $newRow;
                        $pay = Payment::where('cycle_id', $cycle->id)
                            ->where('member_id', $row->id)
                            ->sum('payment');

                        $cycleName = $cycle->month;
                        $sheet->setCellValue("G1",  "$cycleName");

                        $sheet->setCellValue("$cycleRow",  "$pay");

                        $sheet->setCellValue("G{$sumRow}", "=SUM(G2:G{$num})");

                        $sheet->getColumnDimension('G')->setCollapsed(false)->setVisible(true)->setWidth(11);
                        break;
                    case 4:
                        $cycleRow = 'H' . $newRow;
                        $pay = Payment::where('cycle_id', $cycle->id)
                            ->where('member_id', $row->id)
                            ->sum('payment');

                        $cycleName = $cycle->month;
                        $sheet->setCellValue("H1",  "$cycleName");

                        $sheet->setCellValue("$cycleRow",  "$pay");

                        $sheet->setCellValue("H{$sumRow}", "=SUM(H2:H{$num})");

                        $sheet->getColumnDimension('H')->setCollapsed(false)->setVisible(true)->setWidth(11);
                        break;
                    case 5:
                        $cycleRow = 'I' . $newRow;
                        $pay = Payment::where('cycle_id', $cycle->id)
                            ->where('member_id', $row->id)
                            ->sum('payment');

                        $cycleName = $cycle->month;
                        $sheet->setCellValue("I1",  "$cycleName");

                        $sheet->setCellValue("$cycleRow",  "$pay");

                        $sheet->setCellValue("I{$sumRow}", "=SUM(I2:I{$num})");

                        $sheet->getColumnDimension('I')->setCollapsed(false)->setVisible(true)->setWidth(11);
                        break;
                    case 6:
                        $cycleRow = 'J' . $newRow;
                        $pay = Payment::where('cycle_id', $cycle->id)
                            ->where('member_id', $row->id)
                            ->sum('payment');

                        $cycleName = $cycle->month;
                        $sheet->setCellValue("J1",  "$cycleName");

                        $sheet->setCellValue("$cycleRow",  "$pay");

                        $sheet->setCellValue("J{$sumRow}", "=SUM(J2:J{$num})");

                        $sheet->getColumnDimension('J')->setAutoSize(false)->setCollapsed(true);

                        $sheet->getColumnDimension('J')->setCollapsed(false)->setVisible(true)->setWidth(11);
                        break;
                    case 7:
                        $cycleRow = 'K' . $newRow;
                        $pay = Payment::where('cycle_id', $cycle->id)
                            ->where('member_id', $row->id)
                            ->sum('payment');

                        $cycleName = $cycle->month;
                        $sheet->setCellValue("K1",  "$cycleName");

                        $sheet->setCellValue("$cycleRow",  "$pay");

                        $sheet->setCellValue("K{$sumRow}", "=SUM(K2:K{$num})");

                        $sheet->getColumnDimension('K')->setCollapsed(false)->setVisible(true)->setWidth(11);
                        break;
                    case 8:
                        $cycleRow = 'L' . $newRow;
                        $pay = Payment::where('cycle_id', $cycle->id)
                            ->where('member_id', $row->id)
                            ->sum('payment');

                        $cycleName = $cycle->month;
                        $sheet->setCellValue("L1",  "$cycleName");

                        $sheet->setCellValue("$cycleRow",  "$pay");

                        $sheet->setCellValue("L{$sumRow}", "=SUM(L2:L{$num})");

                        $sheet->getColumnDimension('L')->setCollapsed(false)->setVisible(true)->setWidth(11);
                        break;
                    case 9:
                        $cycleRow = 'M' . $newRow;
                        $pay = Payment::where('cycle_id', $cycle->id)
                            ->where('member_id', $row->id)
                            ->sum('payment');

                        $cycleName = $cycle->month;
                        $sheet->setCellValue("M1",  "$cycleName");

                        $sheet->setCellValue("$cycleRow",  "$pay");

                        $sheet->setCellValue("M{$sumRow}", "=SUM(M2:M{$num})");

                        $sheet->getColumnDimension('M')->setCollapsed(false)->setVisible(true)->setWidth(11);
                        break;
                    case 10:
                        $cycleRow = 'N' . $newRow;
                        $pay = Payment::where('cycle_id', $cycle->id)
                            ->where('member_id', $row->id)
                            ->sum('payment');

                        $cycleName = $cycle->month;
                        $sheet->setCellValue("N1",  "$cycleName");

                        $sheet->setCellValue("$cycleRow",  "$pay");

                        $sheet->setCellValue("N{$sumRow}", "=SUM(N2:N{$num})");

                        $sheet->getColumnDimension('N')->setCollapsed(false)->setVisible(true)->setWidth(11);
                        break;
                    case 11:
                        $cycleRow = 'O' . $newRow;
                        $pay = Payment::where('cycle_id', $cycle->id)
                            ->where('member_id', $row->id)
                            ->sum('payment');

                        $cycleName = $cycle->month;
                        $sheet->setCellValue("O1",  "$cycleName");

                        $sheet->setCellValue("$cycleRow",  "$pay");

                        $sheet->setCellValue("O{$sumRow}", "=SUM(O2:O{$num})");

                        $sheet->getColumnDimension('O')->setCollapsed(false)->setVisible(true)->setWidth(11);
                        break;
                    case 12:
                        $cycleRow = 'P' . $newRow;
                        $pay = Payment::where('cycle_id', $cycle->id)
                        ->where('member_id', $row->id)
                            ->sum('payment');

                        $cycleName = $cycle->month;
                        $sheet->setCellValue("P1",  "$cycleName");

                        $sheet->setCellValue("$cycleRow",  "$pay");

                        $sheet->setCellValue("P{$sumRow}", "=SUM(P2:P{$num})");

                        $sheet->getColumnDimension('P')->setCollapsed(false)->setVisible(true)->setWidth(11);
                        break;

                    default:
                        # code...
                        break;
                }
            }

            // total payments
            $sheet->setCellValue("Q{$newRow}", "=SUM(D{$newRow}:P{$newRow})");

            // get welfares
            $welfares = DB::table('welfares')
                        ->where('type', 1)
                        ->where('member_id', $row->id)
                        ->sum('payment');
            $before  = $row->welfare_before;

            $total   = $welfares + $before;
            // total welfares
            $sheet->setCellValue("R{$newRow}", "$total");

            // get welfares owed
            $owed = DB::table('welfares')
                        ->where('type', 0)
                        ->where('member_id', $row->id)
                        ->sum('payment');

            // total welfares owed
            $sheet->setCellValue("S{$newRow}", "$owed");

            // total investment
            $sheet->setCellValue("T{$newRow}", "$row->total_investment");

            // age
            // $sheet->setCellValue("U{$newRow}",  "=ROUND($eng_lang, 2)");
        }

        // Add cell with SUM & AVERAGE formula to TOTALS SECTION
        // totals row
        $sheet->setCellValue("D{$sumRow}", "=SUM(D2:D{$num})");
        $sheet->setCellValue("E{$sumRow}", "=SUM(E2:E{$num})");
        $sheet->setCellValue("F{$sumRow}", "=SUM(F2:F{$num})");
        $sheet->setCellValue("G{$sumRow}", "=SUM(G2:G{$num})");
        $sheet->setCellValue("H{$sumRow}", "=SUM(H2:H{$num})");
        $sheet->setCellValue("I{$sumRow}", "=SUM(I2:I{$num})");
        $sheet->setCellValue("J{$sumRow}", "=SUM(J2:J{$num})");
        $sheet->setCellValue("K{$sumRow}", "=SUM(K2:K{$num})");
        $sheet->setCellValue("L{$sumRow}", "=SUM(L2:L{$num})");
        $sheet->setCellValue("M{$sumRow}", "=SUM(M2:M{$num})");
        $sheet->setCellValue("N{$sumRow}", "=SUM(N2:N{$num})");
        $sheet->setCellValue("O{$sumRow}", "=SUM(O2:O{$num})");
        $sheet->setCellValue("P{$sumRow}", "=SUM(P2:P{$num})");
        $sheet->setCellValue("Q{$sumRow}", "=SUM(Q2:Q{$num})");
        $sheet->setCellValue("R{$sumRow}", "=SUM(R2:R{$num})");
        $sheet->setCellValue("S{$sumRow}", "=SUM(S2:S{$num})");
        $sheet->setCellValue("T{$sumRow}", "=SUM(T2:T{$num})");
        // $sheet->setCellValue("U{$sumRow}", "=SUM(U2:U{$num})");
        // $sheet->setCellValue("V{$sumRow}", "=SUM(V2:V{$num})");
    }

    public function columnWidths(): array
    {
        return [
            'A' => 5,
            'B' => 30,
            'C' => 18,
            'D' => 17,
            'E' => 11,
            'F' => 11,
            'G' => 11,
            'H' => 11,
            'I' => 11,
            'J' => 11,
            'K' => 11,
            'L' => 11,
            'M' => 11,
            'N' => 11,
            'O' => 11,
            'P' => 11,
            'Q' => 13,
            'R' => 13,
            'S' => 13,
            'T' => 13,
            // 'U' => 13,
            // 'V' => 13,
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
            'H' => NumberFormat::FORMAT_NUMBER_00,
            'H' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'I' => NumberFormat::FORMAT_NUMBER_00,
            'I' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'J' => NumberFormat::FORMAT_NUMBER_00,
            'J' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'K' => NumberFormat::FORMAT_NUMBER_00,
            'K' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'L' => NumberFormat::FORMAT_NUMBER_00,
            'L' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'M' => NumberFormat::FORMAT_NUMBER_00,
            'M' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'N' => NumberFormat::FORMAT_NUMBER_00,
            'N' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'O' => NumberFormat::FORMAT_NUMBER_00,
            'O' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'P' => NumberFormat::FORMAT_NUMBER_00,
            'P' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'Q' => NumberFormat::FORMAT_NUMBER_00,
            'Q' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'R' => NumberFormat::FORMAT_NUMBER_00,
            'R' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'S' => NumberFormat::FORMAT_NUMBER_00,
            'S' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            'T' => NumberFormat::FORMAT_NUMBER_00,
            'T' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            // 'U' => NumberFormat::FORMAT_NUMBER_00,
            // 'U' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
            // 'V' => NumberFormat::FORMAT_NUMBER_00,
            // 'V' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
        ];
    }

    public function properties(): array
    {
        return [
            'creator'        => Auth::user()->name,
            'title'          => 'Add Monthly Payment Information',
            'description'    => 'Use this sheet to add new monthly payment infomation',
            // 'subject'        => 'Subject Performance Breakdown',
            'company'        => Env('APP_NAME'),
        ];
    }

    public function view(): View
    {
        // get members 
        $members    = Member::get();

        return view('exports.cycletemplate_full', [
            'members'       =>  $members
        ]);
    }
}
