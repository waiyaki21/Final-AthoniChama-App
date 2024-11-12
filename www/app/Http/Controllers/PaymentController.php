<?php

namespace App\Http\Controllers;

use App\Models\Cycle;
use App\Models\Member;
use App\Models\Payment;
use App\Models\Welfare;
use Illuminate\Http\Request;
use App\Http\Controllers\UpdateController;
use App\Http\Controllers\FinancesController;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function store(Request $request ,Cycle $cycle)
    {
        // validate
        request()->validate([
            // 'cycle_id'          => 'required',
            'member_id'         => 'required',
            'payment'           => 'required',
            'welfare'           => 'required',
            'welfare_owed'      => 'required',
        ]);

        // create payment 
        if ($request->payment != 0) {
            Payment::create([
                'user_id'       => auth()->id(),
                'cycle_id'      => $cycle->id,
                'member_id'     => request('member_id'),
                'payment'       => request('payment'),
            ]);
        }

        // create welfare
        if ($request->welfare != 0) { 
            Welfare::create([
                'user_id'       => auth()->id(),
                'cycle_id'      => $cycle->id,
                'member_id'     => request('member_id'),
                'payment'       => request('welfare'),
                'type'          => 1
            ]);
        }

        // create welfare owed
        if ($request->welfare_owed != 0) {
            Welfare::create([
                'user_id'       => auth()->id(),
                'cycle_id'      => $cycle->id,
                'member_id'     => request('member_id'),
                'payment'       => request('welfare'),
                'type'          => 0
            ]);
        }

        // update cycle & finances 
        $update = new UpdateController();
        $update->updateEverything($cycle);

        // return 
        return back();
    }

    public function storeMember(Request $request, Member $member)
    {
        // validate
        request()->validate([
            'cycle_id'          => 'required',
            'member_id'         => 'required',
            'payment'           => 'required',
            'welfare'           => 'required',
            'type'              => 'required'
        ]);
        
        // create payment 
        if ($request->payment != 0) {
            Payment::create([
                'user_id'       => auth()->id(),
                'cycle_id'      => request('cycle_id'),
                'member_id'     => $member->id,
                'payment'       => request('payment'),
            ]);
        }

        // create welfare 
        if ($request->welfare != 0) { 
            Welfare::create([
                'user_id'       => auth()->id(),
                'cycle_id'      => request('cycle_id'),
                'member_id'     => $member->id,
                'payment'       => request('welfare'),
                'type'          => request('type'),
            ]);
        }

        // get and update cycle & finances 
        $cycle = Cycle::where('id', $request->cycle_id)
                        ->first();

        $update = new UpdateController();
        $update->updateEverything($cycle);

        // return 
        return back();
    }

    public function update(Request $request, Payment $payment)
    {
        //validate the request
        $this->validate($request, [
            'payment'          => 'required',
        ]);

        // request to update payment
        $payment->update($request->all());

        // update the cycle and finances 
        $this->updateAll($payment);

        // return back();
        return [200, null];
    }

    public function destroy(Payment $payment)
    {
        $cycle  = Cycle::where('id', $payment->cycle_id)->first();

        $payment->delete();

        // update the cycle and finances 
        $update = new CycleController();
        $update->updateCycle($cycle);

        // update finances
        $updateFinance = new FinancesController();
        $updateFinance->update();

        // return back();
        return [200, null];
    }

    public function updateAll(Payment $payment) 
    {
        // get cycle & update
        $cycle  = Cycle::where('id', $payment->cycle_id)->first();
        $update = new CycleController();
        $update->updateCycle($cycle);

        // update finances
        $updateFinance = new FinancesController();
        $updateFinance->update();
    }
}
