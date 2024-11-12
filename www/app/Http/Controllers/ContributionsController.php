<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Cycle;
use App\Models\Member;
use App\Models\Payment;
use App\Models\Welfare;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class ContributionsController extends Controller
{
    public function index() {
        // update all 
        // get & update all cycles 
        $cycles         = Cycle::get();
        foreach ($cycles as $cycle) {
            $this->updateCycle($cycle);
        }

        // get all cycles 
        $cycle      = Cycle::where('id', $cycle->id)
            ->with('payments')
            ->first();

        $payments   = Payment::where('cycle_id', $cycle->id)
            ->orderBy('created_at', 'desc')
            ->with('member:id,name')
            ->get();

        $welfares   = Welfare::where('cycle_id', $cycle->id)
            ->orderBy('created_at', 'desc')
            ->with('member:id,name,welfare_before')
            ->get();

        $welfs      = Welfare::where('cycle_id', $cycle->id)
            ->get('member_id');

        $unpaidWel  = Member::whereNotIn('id', $welfs)
            ->get();

        $members    = Member::orderBy('created_at', 'desc')
            ->get();

        if ($cycle->percent != 100) {
            if ($cycle->payments->count() >= $cycle->members_no) {
                $try = 'Cycle not 100%, all members paid but some incomplete';
                $pays = Payment::where([
                    ['cycle_id', $cycle->id],
                    ['payment', '!=', $cycle->amount]
                ])
                    ->get('member_id');

                $unpaid     = Member::whereIn('id', $pays)
                    ->get();
            } else {
                $try = 'Cycle not 100%, not all members paid';
                $pays       = Payment::where('cycle_id', $cycle->id)
                    ->get('member_id');

                $unpaid     = Member::whereNotIn('id', $pays)
                    ->get();
            }
        } else {
            $try = 'Cycle is 100%';
            $pays       = Payment::where('cycle_id', $cycle->id)
                ->get('member_id');

            $unpaid     = Member::whereNotIn('id', $pays)
                ->get();
        }

        return Inertia::render('Contributions', [
            'name'      => env('APP_NAME'),
            'route'     => Route::current()->getName(),
            'cycle'     => $cycle,
            'payments'  => $payments,
            'members'   => $members,
            'welfares'  => $welfares,
            'unpaid'    => $unpaid,
            'unpaidWel' => $unpaidWel
        ]);
    }
}
