<?php

namespace App\Http\Controllers;

use App\Models\Cycle;
use App\Models\Welfare;
use Illuminate\Http\Request;
use App\Http\Controllers\CycleController;
use App\Http\Controllers\FinancesController;

class WelfareController extends Controller
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Welfare $welfare)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Welfare $welfare)
    {
        //
    }

    public function update(Request $request, Welfare $welfare)
    {
        //validate the request
        $this->validate($request, [
            'payment'          => 'required',
        ]);

        // request to update payment
        $welfare->update($request->all());

        // update the cycle and finances 
        $this->updateAll($welfare->cycle_id);

        // return back();
        return [200, null];
    }

    public function destroy(Welfare $welfare)
    {
        $welfare->delete();

        // update the cycle and finances 
        $cycleID = $welfare->cycle_id;
        $this->updateAll($cycleID);

        return back();
        // return response()->json([200, null]);
        return [200, null];
    }

    public function updateAll($id)
    {
        // get cycle & update
        $cycle  = Cycle::where('id', $id)->first();
        $update = new CycleController();
        $update->updateCycle($cycle);

        // update finances
        $updateFinance = new FinancesController();
        $updateFinance->update();
    }
}
