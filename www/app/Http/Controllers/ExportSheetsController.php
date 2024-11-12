<?php

namespace App\Http\Controllers;

use App\Models\Cycle;
use App\Models\Member;
use App\Exports\LedgerYear;
use Illuminate\Http\Request;
use App\Exports\CyclesExport;
use App\Exports\MemberSingle;
use App\Exports\LedgersSelect;
use App\Exports\MembersLedger;
use App\Exports\CyclesTemplate;
use App\Exports\CyclesExportAll;
use App\Exports\MembersTemplate;
use App\Exports\CyclesExportActive;
use App\Exports\CyclesTemplateFull;
use App\Exports\CyclesTemplateModal;
use Maatwebsite\Excel\Facades\Excel;

class ExportSheetsController extends Controller
{
    //......................... CYCLES EXPORTS ...........................................
    // download the complete export 
    public function exportCycle(Cycle $cycle)
    {
        $name = strtoupper($cycle->name);

        return Excel::download(new CyclesExport($cycle), "$name CONTRIBUTIONS REPORT  - PAID MEMBERS.xlsx");
    }

    // download the active members in a cycle 
    public function exportCycleActive(Cycle $cycle)
    {
        $name = strtoupper($cycle->name);

        return Excel::download(new CyclesExportActive($cycle), "$name CONTRIBUTIONS REPORT - ACTIVE MEMBERS.xlsx");
    }

    // download all members 
    public function exportCycleAll(Cycle $cycle)
    {
        $name = strtoupper($cycle->name);

        return Excel::download(new CyclesExportAll($cycle), "$name CONTRIBUTIONS REPORT  - ALL MEMBERS.xlsx");
    }

    // download the template to fill in info 
    public function exportCycleTemplate(Cycle $cycle)
    {
        $name = strtoupper($cycle->name);

        return Excel::download(new CyclesTemplate($cycle), "$name CONTRIBUTIONS & WELFARES TEMPLATE.xlsx");
    }

    public function exportCycleTemplateFull($year)
    {
        return Excel::download(new CyclesTemplateFull($year), "$year CONTRIBUTIONS & WELFARES TEMPLATE.xlsx");
    }

    public function exportCycleTemplateModal($month, $year)
    {
        $name = strtoupper($month . ' ' . $year);

        return Excel::download(new CyclesTemplateModal(), "$name CONTRIBUTIONS & WELFARES TEMPLATE.xlsx");
    }
    // end excel functions 


    // ................ MEMBER EXPORTS .......................
    // excel sheets 
    public function exportMemberTemplate()
    {
        $name = 'Enter New Members';

        return Excel::download(new MembersTemplate(), "$name Template.xlsx");
    }

    public function exportTemplateMember(Member $member)
    {
        $name = strtoupper($member->name . ' Financial Report');

        return Excel::download(new MemberSingle($member), "$name Template.xlsx");
    }


    // ................. LEDGER EXPORTS.........................
    public function exportLedger()
    {
        $name = strtoupper('Payments & Welfares Ledger');

        return Excel::download(new MembersLedger(), "$name Template.xlsx");
    }

    public function exportLedgerYear($year)
    {
        $name = strtoupper('Full ' . $year . ' Payments & Welfares Ledger');

        return Excel::download(new LedgerYear($year), "$name Template.xlsx");
    }

    public function exportLedgerCycle(Cycle $cycle)
    {
        $name = strtoupper('Full ' . $cycle->month . ' ' . $cycle->year . ' Payments & Welfares Ledger');

        return Excel::download(new CyclesExport($cycle), "$name Template.xlsx");
    }

    public function exportLedgerCycleSelection($from, $to)
    {
        $start = Cycle::find($from);
        $end   = Cycle::find($to);

        $name = strtoupper('Ledger payments: ' . $start->name . ' - ' . $end->name);

        $cycles = Cycle::whereBetween('id', [$to, $from])
        ->with('payments')
        ->get();

        return Excel::download(new LedgersSelect($cycles, $from, $to), "$name.xlsx");

        // return [$start, $end, $name, $cycles];
    }
}
