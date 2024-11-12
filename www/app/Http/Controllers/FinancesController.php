<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Cycle;
use App\Models\CycleExpense;
use App\Models\CycleExpenseNames;
use App\Models\Member;
use App\Models\Expense;
use App\Models\Payment;
use App\Models\Project;
use App\Models\Setting;
use App\Models\Welfare;
use App\Models\Finances;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FinancesController extends Controller
{
    public function store() 
    {
        // create settings 
        $this->updateSettings();

        // create default cycle expense names 
        $this->updateExpenseNames();

        $finances = Finances::count();

        // create finance record
        if($finances == 0)
        {
            Finances::create([
                'user_id'       => auth()->id(),
                'members_no'    => 0,
                'cycles_no'     => 0,
                'total_pays'    => 0,
                'projects_no'   => 0,
                'projects_comp' => 0,
                'total_expenses'=> 0,
                'money_left'    => 0,
                'total_welfare' => 0,
            ]);
        }

        // update finances 
        $this->update();
    }

    public function update() 
    {
        // get settings 
        $settings = Setting::first();

        // cycles info 
        $cycles     = DB::table('cycles')
                        ->where('deleted_at', null)
                        ->count();

        // payments info 
        $pays       = Payment::sum('payment');
        $prevPays   = DB::table('members')
                        ->where('deleted_at',null)
                        ->sum('amount_before');
        $totalPays  = $pays + $prevPays;

        // welfares info 
        // convert from negatives 
        $this->convertNegative();
        $welf_in    = Welfare::where('type', 1)->sum('payment');
        $welf_out   = Welfare::where('type', 0)->sum('payment');

        $prevWelfs  = DB::table('members')
                        ->where('deleted_at',null)
                        ->sum('welfare_before');

        $prevOwedApril   = DB::table('members')
                        ->where('deleted_at',null)
                        ->sum('welfareowed_before');

        $prevOwedMay   = DB::table('members')
                        ->where('deleted_at',null)
                        ->sum('welfare_owing_may');

        $totalWelfs = $welf_in + $prevWelfs;
        $totalOwed  = $welf_out + $prevOwedApril + $prevOwedMay;
        $welfares   = $totalWelfs - $totalOwed;

        // projects & expenses info 
        $projects   = Project::count();
        $exps       = Expense::sum('amount');
        $cycle_exps = CycleExpense::sum('amount');
        $totalExps  = $exps + $cycle_exps;
        $completed  = Project::where('completed', 1)->count();

        // grand Totals 
        $allMoney   = $totalPays + $totalWelfs;
        $money_out  = $totalExps + $totalWelfs;
        $money_left = $allMoney  - $money_out;

        // members 
        $members    = DB::table('members')
                        ->where('deleted_at',null)
                        ->count();

        $check      = Member::where('total_investment', '>', 0)->get('id','name');
        $investments = $check->sum('total_investment');

        // percentage 
        if ($totalPays == 0) {
            $percentage = 0;
        } else {
            $percentage = round(($money_left / $allMoney * 100), 2);
        }

        // update 
        $finance = Finances::orderBy('created_at', 'desc')->first();

        Finances::where('id', $finance->id)
                ->orderBy('created_at', 'desc')
                ->update([
                    // cycles info 
                    'cycles_no'     => $cycles,

                    // members info 
                    'members_no'    => $members,

                    // payments info 
                    'total_pays'    => $totalPays,

                    // projects & expenses info 
                    'projects_no'   => $projects,
                    'projects_comp' => $completed,
                    'total_expenses'=> $totalExps,

                    // welfares info 
                    'welfare_in'    => $totalWelfs,
                    'welfare_out'   => $totalOwed,
                    'total_welfare' => $welfares,

                    // In bank
                    'money_left'    => $investments,
                    'money_out'     => $money_out,
                    'all_money'     => $allMoney,

                    // percentage 
                    'percent'       => $percentage,

                    // defaults 
                    'payment_def'   => $settings->payment_def,
                    'welfare_def'   => $settings->welfare_def,
                ]);

        // update 
        $finance = Finances::orderBy('created_at', 'desc')->first();

        return $finance;
    }

    public function updateSettings() 
    {
        // settings info 
        $name  = 'Athoni Development and Welfare';
        $short = 'Athoni D & W';

        // create the settings 
        Setting::create([
            'user_id'       => auth()->id(),
            'name'          => $name,
            'shortname'     => $short,
            'payment_def'   => 2500,
            'welfare_def'   => 500,
        ]);
    }

    public function updateExpenseNames()
    {
        // $names = CycleExpenseNames::count();

        $namesData = [
            [
                'name' => 'Unclassified',
            ],
            [
                'name' => 'BANK BALANCE C/F',
            ],
            [
                'name' => 'LESS BANK CHARGES',
            ],
            [
                'name' => 'LESS C/WITHDRAWAL FOR AGM',
            ],
            [
                'name' => 'AUDIT & LEGAL FEES',
            ],
            [
                'name' => 'SECRETARY FEE',
            ],
            [
                'name' => 'ADMIN EXPENSES',
            ],
            [
                'name' => 'DEVELOPMENT EXPENSES',
            ],
            [
                'name' => 'WELFARE TOKEN',
            ],
            [
                'name' => 'AGM',
            ],
            [
                'name' => 'ADMIN/SECRETARIAL EXPENSES',
            ],
            [
                'name' => 'CIC INVESTMENT',
            ],
            [
                'name' => 'SHARE TRANSFER',
            ],
            [
                'name' => 'BANK / MPESA CHARGES',
            ]
        ];

        foreach ($namesData as $data) {
            CycleExpenseNames::updateOrCreate(
                ['name' => $data['name']]
            );
        }

        $names = CycleExpenseNames::orderBy('created_at', 'desc')
                                    ->get();

        return $names;
    }

    function createNextCycle()
    {
        // get settings 
        $settings = Setting::first();

        // next name 
        $date       = Carbon::now()->format('d/m/Y');
        $next_name  = Carbon::now()->addMonth()->format('F y');

        // create a cycle 
        Cycle::create([
            'user_id'       => auth()->id(),
            'name'          => $next_name,
            'date'          => $date,
            'amount'        => $settings->payment_def,
            'welfare_amnt'  => $settings->welfare_def,
            'members_no'    => 0,
            'total'         => 0,
            'percent'       => 0,
            'completed'     => 0,
        ]);
    }

    function convertNegative() 
    {
        $welf_out   = Welfare::where('type', 0)->where('payment', '<', '0')->get();

        foreach($welf_out as $welf) {
            $new = abs($welf->payment);

            Welfare::where('id', $welf->id)
                    ->update([
                        'payment' => $new
                    ]);
        }

        $mem_out   = Member::where('welfareowed_before','<', '0')->get();

        foreach($mem_out as $mem) {
            $new = abs($mem->welfareowed_before);

            Member::where('id', $mem->id)
                    ->update([
                        'welfareowed_before' => $new
                    ]);
        }
    }
}
