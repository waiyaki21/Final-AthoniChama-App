<?php

namespace App\Http\Controllers;

use App\Models\Cycle;
use App\Models\CycleExpense;
use App\Models\CycleExpenseNames;
use Illuminate\Http\Request;

class CycleExpenseController extends Controller
{
    public function store(Request $request, Cycle $cycle)
    {
        // return $request;
        // validate
        request()->validate(
            [
                'name'          => 'required|',
                'amount'        => 'required|integer|min:1',
                'name_id'       => 'required',
            ],
            [
                'name.required'         => 'Expense name is required!',
                'amount.required'       => 'Expense amount is required!',
                'name_id'               => 'Expense Catergory is required',
            ]
        );

        // create monthly expense 
        CycleExpense::create([
            'user_id'       => auth()->id(),
            'cycle_id'      => $cycle->id,
            'name_id'       => $request->name_id,
            'name'          => $request->name,
            'amount'        => $request->amount,
        ]);

        $update = new CycleController();
        $update->updateCycle($cycle);

        // return 
        return response()->json([200, 'ok']);
    }

    public function update(Request $request, CycleExpense $cycleExpense)
    {
        //validate the request
        $this->validate($request, [
            'name'           => 'required',
            'amount'         => 'required|integer|min:1',
        ]);

        $cycleExpense->update($request->all());

        $cycle = Cycle::where('id', $cycleExpense->cycle_id)
                      ->first();

        $finances = new CycleController();
        $finances->updateCycle($cycle);

        // return 
        return response()->json([200, 'ok']);
    }

    public function destroy(CycleExpense $cycleExpense)
    {
        $cycle = Cycle::where('id', $cycleExpense->cycle_id)
            ->first();

        $cycleExpense->delete();

        // update finances records
        $finances = new CycleController();
        $finances->updateCycle($cycle);

        return back();
    }

    // API CALLS 
    public function getCycleExpenses(Cycle $cycle)
    {
        $cycleExpenses = CycleExpense::where('cycle_id', $cycle->id)
                                    ->orderBy('created_at', 'desc')
                                    ->get();

        // if (CycleExpenseNames::count() < 13) {
        //     $getNames = new FinancesController();
        //     $names = $getNames->updateExpenseNames();
        // } else {
            $names = CycleExpenseNames::orderBy('created_at', 'desc')->get();
        // }

        return [$cycleExpenses, $names];
    }

    public function getAllCycleExpenses()
    {
        $cycleExpenses = CycleExpense::orderBy('created_at', 'desc')
                                        ->get();

        return $cycleExpenses;
    }
}
