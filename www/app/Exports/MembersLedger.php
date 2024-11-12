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

class MembersLedger implements FromView, WithEvents, WithColumnWidths, WithStyles, WithProperties, ShouldAutoSize, WithColumnFormatting
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

    public function cyclesInfo()
    {
        $months_array[0]  = (object) array('month' => strtoupper('January'),      'row' => 'E');
        $months_array[1]  = (object) array('month' => strtoupper('February'),     'row' => 'F');
        $months_array[2]  = (object) array('month' => strtoupper('March'),        'row' => 'G');
        $months_array[3]  = (object) array('month' => strtoupper('April'),        'row' => 'H');
        $months_array[4]  = (object) array('month' => strtoupper('May'),          'row' => 'I');
        $months_array[5]  = (object) array('month' => strtoupper('June'),         'row' => 'J');
        $months_array[6]  = (object) array('month' => strtoupper('July'),         'row' => 'K');
        $months_array[7]  = (object) array('month' => strtoupper('August'),       'row' => 'L');
        $months_array[8]  = (object) array('month' => strtoupper('September'),    'row' => 'M');
        $months_array[9]  = (object) array('month' => strtoupper('October'),      'row' => 'N');
        $months_array[10] = (object) array('month' => strtoupper('November'),     'row' => 'O');
        $months_array[11] = (object) array('month' => strtoupper('December'),     'row' => 'P');

        // get year cycles no 
        $cycles = DB::table('cycles')->where('deleted_at', null)->orderBy('id', 'asc')->limit(12)->get();
        $count  = $cycles->count();

        $months_rows    = array_slice($months_array, 0, $count);

        // create array 
        $allCycles  = array();
        foreach ($cycles as $index => $cycle) {
            // create the array 
            $rec    = array(
                'id'    => $cycle->id,
                'month' => $cycle->month,
                'year'  => $cycle->year,
                'name'  => $cycle->name,
                'row'   => $months_rows[$index]->row,
                'show'  => 'true',
            );
            array_push($allCycles, $rec);
        }

        return $allCycles;
    }

    public function styles(Worksheet $sheet)
    {
        // sheet rows 
        $sheet->getColumnDimension('E')->setAutoSize(false)->setVisible(false)->setCollapsed(true);
        $sheet->getColumnDimension('F')->setAutoSize(false)->setVisible(false)->setCollapsed(true);
        $sheet->getColumnDimension('G')->setAutoSize(false)->setVisible(false)->setCollapsed(true);
        $sheet->getColumnDimension('H')->setAutoSize(false)->setVisible(false)->setCollapsed(true);
        $sheet->getColumnDimension('I')->setAutoSize(false)->setVisible(false)->setCollapsed(true);
        $sheet->getColumnDimension('J')->setAutoSize(false)->setVisible(false)->setCollapsed(true);
        $sheet->getColumnDimension('K')->setAutoSize(false)->setVisible(false)->setCollapsed(true);
        $sheet->getColumnDimension('L')->setAutoSize(false)->setVisible(false)->setCollapsed(true);
        $sheet->getColumnDimension('M')->setAutoSize(false)->setVisible(false)->setCollapsed(true);
        $sheet->getColumnDimension('N')->setAutoSize(false)->setVisible(false)->setCollapsed(true);
        $sheet->getColumnDimension('O')->setAutoSize(false)->setVisible(false)->setCollapsed(true);
        $sheet->getColumnDimension('P')->setAutoSize(false)->setVisible(false)->setCollapsed(true);

        // get table headers
        $sheet->setCellValue("A1",  "No");
        $sheet->setCellValue("B1",  "Members Name");
        $sheet->setCellValue("C1",  "Telephone No");
        $sheet->setCellValue("D1",  "Total Contributions B/F");
        $sheet->setCellValue("Q1",  "Total Contributions");
        $sheet->setCellValue("R1",  "Total Welfare");
        $sheet->setCellValue("S1",  "Total Welfare Owing");
        $sheet->setCellValue("T1",  "Total Investment");
        $sheet->setCellValue("U1",  "%Age");

        // get all members 
        $rows   = Member::where('deleted_at', null)->get();
        // get all cycles
        $cycles = $this->cyclesInfo();

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

            // get all prev cycles sum
            $paysBefore = Payment::where([
                                ['cycle_id', '<', $cycles[0]['id']],
                                ['member_id', $row->id]
                            ])
                                ->sum('payment');
            $totalBefore = intval($row->amount_before) + $paysBefore;
            $sheet->setCellValue("D{$newRow}",  "$totalBefore");

            foreach ($cycles as $cycle) {

                $first  = 1;
                $second = 2;

                // Rows 
                // first & second row
                $firstRow  = strval($cycle['row'] . $first);
                $secondRow = $cycle['row'] . $second;
                // payment rows
                $paysRow   = $cycle['row'] . $newRow;
                // total rows
                $totalRow  = $cycle['row'] . $sumRow;
                // end row
                $endRow    = $cycle['row'] . $num;

                // get pays 
                $pay = Payment::where('cycle_id', $cycle['id'])
                            ->where('member_id', $row->id)
                            ->sum('payment');

                $cycleName = $cycle['month'] . ' ' . $cycle['year'];

                $sheet->setCellValue("$firstRow",  "$cycleName");

                $sheet->setCellValue("$paysRow",  "$pay");

                $sheet->setCellValue("$totalRow", "=SUM(" . $secondRow . ":" . $endRow . ")");

                $sheet->getColumnDimension($cycle['row'])->setCollapsed(false)->setVisible($cycle['row'])->setWidth(15);
            }

            // total payments
            $sheet->setCellValue("Q{$newRow}", "=SUM(D{$newRow}:P{$newRow})");

            // get welfares
            $total  = $row->total_in;

            // total welfares in
            $sheet->setCellValue("R{$newRow}", "$total");

            // get welfares owed
            $owed  = $row->welfare_out;

            // total welfares owed
            $sheet->setCellValue("S{$newRow}", "$owed");

            // total investment
            $sheet->setCellValue("T{$newRow}", "$row->total_investment");

            // percentage
            $percent  = round($row->total_shares,1) ."%";
            $sheet->setCellValue("U{$newRow}", "$percent");
        }

        // Add cell with SUM & AVERAGE formula to TOTALS SECTION
        // totals row
        $sheet->setCellValue("D{$sumRow}", "=SUM(D2:D{$num})");
        $sheet->setCellValue("P{$sumRow}", "=SUM(P2:P{$num})");
        $sheet->setCellValue("Q{$sumRow}", "=SUM(Q2:Q{$num})");
        $sheet->setCellValue("R{$sumRow}", "=SUM(R2:R{$num})");
        $sheet->setCellValue("S{$sumRow}", "=SUM(S2:S{$num})");
        $sheet->setCellValue("T{$sumRow}", "=SUM(T2:T{$num})");
        $sheet->setCellValue("U{$sumRow}", "=ROUND(SUM(U2:U{$num}), 0)");
    }

    public function columnWidths(): array
    {
        return [
            'A' => 5,
            'B' => 30,
            'C' => 12,
            'D' => 18,
            'Q' => 15,
            'R' => 15,
            'S' => 15,
            'T' => 15,
            'U' => 12,
            'V' => 15,
            'W' => 15,
            'X' => 15,
            'Y' => 15,
            'Z' => 15,
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
        ];
    }

    public function properties(): array
    {
        return [
            'creator'        => Auth::user()->name,
            'title'          => 'View Full Members Ledger',
            'description'    => 'View upto 12 months of member contributions',
            // 'subject'        => 'Subject Performance Breakdown',
            'company'        => Env('APP_NAME'),
        ];
    }

    public function view(): View
    {
        // get all cycles 
        $cycles     = Cycle::orderBy('created_at', 'desc')
                            // ->with('payments')
                            ->limit(12)
                            ->get();

        // get all members 
        $members    = Member::get();

        return view('exports.members_ledger', [
            'members'       =>  $members,

            'cycles'         =>  $cycles,
        ]);
    }
}
