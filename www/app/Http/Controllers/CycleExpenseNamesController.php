<?php

namespace App\Http\Controllers;

use App\Models\CycleExpense;
use App\Models\CycleExpenseNames;
use Illuminate\Http\Request;

class CycleExpenseNamesController extends Controller
{
    public function store(Request $request)
    {
        // return $request;
        // validate
        request()->validate(
            [
                'name'          => 'required|',
            ],
            [
                'name.required'         => 'Expense Type name is required!',
            ]
        );

        // create expense type
        CycleExpenseNames::create([
            'name'          => $request->name,
        ]);

        // return 
        return response()->json([200, 'ok']);
    }

    public function update(Request $request, CycleExpenseNames $cycleExpenseNames)
    {
        //validate the request
        $this->validate($request, [
            'name'           => 'required',
        ]);

        $cycleExpenseNames->update($request->all());

        // return 
        return response()->json([200, 'ok']);
    }

    public function destroy(CycleExpenseNames $cycleExpenseNames)
    {
        if ($cycleExpenseNames->name != 'Unclassified') {
            $unclassified = CycleExpenseNames::where('name', 'Unclassified')->first();

            // update all expenses 
            CycleExpense::where('name_id', $cycleExpenseNames->id)
                ->update([
                    'name_id'   => $unclassified->id,
                    'name'      => $unclassified->name
                ]);
            //delete the record
            $cycleExpenseNames->delete();

            $message    = 'Expense Type Successfully Deleted!';
            $type = 'delete';

            // return response
            return [$message, $type];
        } else {
            $message    = 'Unclassified : Expense Type cannot be Deleted!';
            $type = 'info';

            // return response
            return [$message, $type];
        }
    }

    public function destroyCycleExpenseName(CycleExpenseNames $cycleExpenseNames)
    {
        if ($cycleExpenseNames->name != 'Unclassified') {
            $unclassified = CycleExpenseNames::where('name', 'Unclassified')->first();

            // update all expenses 
            CycleExpense::where('name_id', $cycleExpenseNames->id)
                    ->update([
                        'name_id'   => $unclassified->id,
                        'name'      => $unclassified->name
                    ]);
            //delete the record
            $cycleExpenseNames->delete();

            $message    = 'Expense Type Successfully Deleted!';
            $type = 'delete';

            // return response
            return [$message, $type];
        } else {
            $message    = 'Unclassified : Expense Type cannot be Deleted!';
            $type = 'info';

            // return response
            return [$message, $type];
        }
    }
}
