<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Cycle;
use App\Models\Expense;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FinancesController;

class ExpenseController extends Controller
{
    public function index()
    {
    }

    public function store(Request $request, Project $project)
    {
        // validate
        request()->validate(
            [
                'name'          => 'required',
                'cycle_id'      => 'required',
                'amount'        => 'required'
            ],
            [
                'name.required'         => 'Expense name is required!',
                'cycle_id.required'     => 'Expense Cycle is required!',
                'amount.required'       => 'Expense Amount is required!',
            ]
        );

        // create expense 
        Expense::create([
            'user_id'       => auth()->id(),
            'cycle_id'      => request('cycle_id'),
            'project_id'    => $project->id,
            'name'          => request('name'),
            'amount'        => request('amount'),
        ]);

        // update project 
        $total      = Expense::where('project_id', $project->id)
                            ->sum('amount');

        // if zero exists 
        if ($project->total_expenses == 0 || $project->target == 0) {
            $percent = 0;
        } else {
            $percent = number_format(($project->total_expenses / $project->target) * 100);
        }

        if ($percent != 100) {
            $comp = 0;
        } else {
            $comp = 1;
        }

        Project::where('id', $project->id)
            ->update([
                'total_expenses' => $total,
                'completed'      => $comp
            ]);

        $finances = new FinancesController();
        $finances->update();

        //return with info
        return back();
    }

    public function update(Request $request, Expense $expense)
    {
        //validate the request
        $this->validate($request, [
            'name'           => 'required',
            'amount'         => 'required',
        ]);

        // request to update project
        $expense->update($request->all());

        // get & update project 
        $project = $this->getProject($expense->project_id);
        $this->updateProject($project);

        // get & update finances 
        $finances = new FinancesController();
        $finances->update();

        //alert checks
        // $route = 'update';
        // $alert = $this->alerts($project, $route);

        //return with info
        return back();
    }

    public function destroy(Expense $expense)
    {
        // expense delete 
        $expense->delete();

        //alert checks
        $project = $this->getProject($expense->project_id);
        $this->updateProject($project);

        // $route   = 'delete';
        // $alert   = $this->alerts($project, $route);

        // get & update finances 
        $finances = new FinancesController();
        $finances->update();

        //return with info
        $test = new ProjectController();
        $show = $test->show($project);

        return back()->with(['message' => 'Deleted Successfully']);
    }

    public function alerts(Project $project, $route)
    {
        if ($route = 'update') {
            $info = 'Expense Updated Successfully!';
            if ($project->total_expenses == $project->target) {
                $message = $info.' Project Fully Funded!';
                $state   = 'success';
            } else {
                $message = $info;
                $state   = 'info';
            }
        } elseif ($route == 'post') {
            $info = 'Expense Added Successfully!';
            if ($project->total_expenses == $project->target) {
                $message = $info.' - Project Fully Funded!';
                $state   = 'success';
            } else {
                $percent = round(($project->total_expenses / $project->target * 100), 2);
                $info2   = 'Project Funding - '.$percent. '%';
                $message = $info .' - '. $info2;
                $state   = 'info';
            }
        } elseif ($route == 'delete') {
            $message = 'Expense Deleted Successfully!';
            $state   = 'danger';
        }
        
        return [$state, $message];
    }

    public function getProject($id)
    {
        $project    = Project::where('id', $id)
                            ->with('expenses')
                            ->first();

        return $project;
    }

    public function getExpenses($id)
    {
        $expenses = Expense::where('project_id', $id)
                            ->orderBy('created_at', 'asc')
                            ->with('cycle:id,name','project:id,name')
                            ->get();

        return [$expenses];
    }

    public function updateProject(Project $project) 
    {
        $total      = Expense::where('project_id', $project->id)
                            ->sum('amount');

        // if zero exists 
        if ($project->total_expenses == 0 || $project->target == 0) {
            $percent = 0;
        } else {
            $percent = number_format(($project->total_expenses / $project->target) * 100);
        }
        
        if ($percent != 100) {
            $comp = 0;
        } else {
            $comp = 1;
        }

        $project    = Project::where('id', $project->id)
                            ->update([
                                'total_expenses' => $total,
                                'completed'      => $comp
                            ]);
    }
}
