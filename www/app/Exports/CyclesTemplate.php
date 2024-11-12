<?php

namespace App\Exports;

use App\Models\Cycle;
use App\Models\Member;

use App\Models\Payment;
use App\Models\Setting;
use App\Models\Welfare;
use App\Exports\Helpers\ExcelStyles;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\View\View;
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

class CyclesTemplate implements FromView, WithEvents, WithColumnWidths, WithStyles, WithProperties, ShouldAutoSize,
    WithColumnFormatting
{
    private $cycle;

    public function __construct($cycle)
    {
        $this->cycle = $cycle;
    }

    public function getPaidCycleMembers() : array 
    {
        $ids        = Payment::where('cycle_id', $this->cycle->id)->get('member_id');
        $paid       = DB::table('members')->where('deleted_at', null)->whereIn('id', $ids)->get();

        return [$paid, $paid->count()];
    }

    public function getUnpaidCycleMembers(): array
    {
        $ids        = Payment::where('cycle_id', $this->cycle->id)->get('member_id');
        $unpaid     = DB::table('members')->where('deleted_at', null)->whereNotIn('id', $ids)->get();

        return [$unpaid ,$unpaid->count()];
    }

    public function registerEvents(): array
    {   
        return [
            AfterSheet::class   => function (AfterSheet $event) {
                // Get styles
                $styles = ExcelStyles::getExcelStyles();
                
                // get members count 
                $info     = $this->getUnpaidCycleMembers();
                $counts   = $info[1];  

                // columns are 4 from a - e 
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

        $sheet->setCellValue("A1",  "ID");
        $sheet->setCellValue("B1",  "Members Name");
        $sheet->setCellValue("C1",  "Contributions");
        $sheet->setCellValue("D1",  "Welfare In");
        $sheet->setCellValue("E1",  "Welfare Owing");

        // get members & count 
        $info      = $this->getUnpaidCycleMembers();
        $rows      = $info[0];
        $numOfRows = $info[1];  

        $num       = $numOfRows + 1;
        $sumRow    = $numOfRows + 2;

        $welf      = $this->cycle->welfare_amnt;

        foreach ($rows as $index => $row) {
            // get members row 
            $newRow = $index + 2;

            // set values 
            $sheet->setCellValue("A{$newRow}",  "$row->id");
            $sheet->setCellValue("B{$newRow}",  "$row->name");
            $sheet->setCellValue("E{$newRow}", "=ABS(D{$newRow} - $welf)");
        }

        // Add cell with SUM & AVERAGE formula to TOTALS SECTION
        // total contributions 
        $sheet->setCellValue("C{$sumRow}", "=SUM(C2:C{$num})");
        // total welfare in
        $sheet->setCellValue("D{$sumRow}", "=SUM(D2:D{$num})");
        // total welfare owed
        $sheet->setCellValue("E{$sumRow}", "=SUM(E2:E{$num})");
    }

    public function columnWidths(): array
    {
        return [
            'A' => 5,
            'B' => 30,
            'C' => 15,
            'D' => 15,
            'E' => 15,
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
            'title'          => $this->cycle->name . ' Payments and Welfare Records',
            'description'    => 'Use this sheet to add new member payments and welfare records to the payment cycle',
            // 'subject'        => 'Subject Performance Breakdown',
            'company'        => $setting->shortname,
        ];
    }

    public function view(): View
    {
        $ids        = Payment::where('cycle_id', $this->cycle->id)
                             ->get('member_id');

        $pays       = Payment::where('cycle_id', $this->cycle->id)
                             ->get();

        $wels       = Welfare::where('cycle_id', $this->cycle->id)
                            ->where('type', 1)
                            ->get();

        $owes       = Welfare::where('cycle_id', $this->cycle->id)
                            ->where('type', 0)
                            ->get();

        $unpaid     = Member::whereNotIn('id', $ids)
                            ->get();

        $paid       = Member::whereIn('id', $ids)
                            ->get();

        return view('exports.cycle_template', [
            'members'       =>  $unpaid,

            'paid'          =>  $paid,

            'welfare'       =>  $wels,

            'owes'          =>  $owes,

            'pays'          =>  $pays,

            'cycle'         =>  $this->cycle,
        ]);
    }
}
