<?php

namespace App\Http\Controllers;

use App\Models\Cycle;

use App\Models\Member;
use App\Models\Expense;
use App\Models\Payment;
use App\Models\Project;
use App\Models\Setting;
use App\Models\Welfare;
use App\Models\Finances;
use App\Http\Controllers\CycleController;
use App\Http\Controllers\FinancesController;

class UpdateController extends Controller
{
    public function reloadEverything()
    {
        // get latest cycle 
        $cycle = Cycle::orderBy('created_at', 'desc')->first();
        
        // update cycle 
        $update = new CycleController();
        $update->updateCycle($cycle);

        // update finances
        $updateFinance = new FinancesController();
        $updateFinance->update();
    }
    
    public function updateEverything(Cycle $cycle)
    {
        // update cycle 
        $update = new CycleController();
        $update->updateCycle($cycle);

        // update finances
        $updateFinance = new FinancesController();
        $updateFinance->update();
    }

    public function deleteEverything()
    {
        // destroy welfares
        $welfares = Welfare::get();
        $welfares->each->forceDelete();

        // destroy payments
        $payments = Payment::get();
        $payments->each->forceDelete();

        // destroy expenses
        $expenses = Expense::get();
        $expenses->each->forceDelete();

        // destroy projects
        $projects = Project::get();
        $projects->each->forceDelete();

        // destroy members
        $members = Member::get();
        $members->each->forceDelete();

        // destroy cycles
        $cycles = Cycle::get();
        $cycles->each->forceDelete();

        // destroy setting
        $setting = Setting::get();
        $setting->each->forceDelete();

        // destroy finances
        $finances = Finances::get();
        $finances->each->forceDelete();

        // update finances
        $updateFinance = new FinancesController();
        $updateFinance->store();

        $message = 'ALL INFO DELETED!';

        // return redirect('/settings');
    }
}
