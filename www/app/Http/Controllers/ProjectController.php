<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Cycle;
use App\Models\Expense;
use App\Models\Payment;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\FinancesController;

class ProjectController extends Controller
{
    public function index()
    {
        // get all projects 
        $projects = Project::orderBy('created_at', 'desc')
                            // ->with('expenses')
                            ->get();

        $completed = Project::where('completed', 1)
                            ->count();

        // project target totals
        $projectSum  = Project::sum('target');

        // expense total
        $expSum      = Expense::sum('amount');

        // payment total
        $paySum      = Payment::sum('payment');

        // get balance 
        $balance     = $projectSum - $expSum;

        if ($projects->count() == 0) {
            $totalPercent = 0;
        } else {
            $totalPercent = number_format(($expSum / $projectSum) * 100);
        }
        
        // return [$projects, $totalPercent, $projectSum ,$paySum, $balance];

        return Inertia::render('Projects', [
            'name'      => env('APP_NAME'),
            'route'     => Route::current()->getName(),
            'projects'  => $projects,
            'expSum'    => $expSum,
            'paySum'    => $paySum,
            'balance'   => $balance,
            'completed' => $completed,
            'projectSum'=> $projectSum,
            'totalPercent' => $totalPercent
        ]);
    }

    public function store(Request $request)
    {
        // get latest cycle 
        $cycle = Cycle::orderBy('created_at', 'desc')->first();

        // validate
        request()->validate(
            [
                'name'          => 'required|',
                'target'        => 'required|integer|min:1',
            ],
            [
                'name.required'         => 'Project name is required!',
                'target.required'       => 'Project target is required!',
            ]
        );

        // create project 
        Project::create([
            'user_id'       => auth()->id(),
            'cycle_id'      => $cycle->id,
            'name'          => request('name'),
            'target'        => request('target'),
        ]);

        $finances = new FinancesController();
        $finances->update();

        // return 
        return back();
    }

    public function show(Project $project)
    {
        // get all projects 
        $project = Project::where('id', $project->id)
            ->with('expenses')
            ->first();

        $expenses = Expense::where('project_id', $project->id)
            ->orderBy('created_at', 'asc')
            ->with('cycle')
            ->get();

        // get all cycles 
        $cycles      = DB::table('cycles')->orderBy('id', 'desc')->where('deleted_at', null)->limit(12)
                            ->get(['id','name']);

        return Inertia::render('Expenses', [
            'name'      => env('APP_NAME'),
            'route'     => Route::current()->getName(),
            'project'   => $project,
            'expenses'  => $expenses,
            'cycles'    => $cycles,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        //validate the request
        $this->validate($request, [
            'name'           => 'required',
            'target'         => 'required|integer|min:1',
        ]);

        // request to update project
        $total      = Expense::where('project_id', $project->id)
                                ->sum('amount');

        // if zero exists 
        if ($project->total_expenses == 0 || $project->target == 0
        ) {
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
                                'name'           => $request->name,
                                'target'         => $request->target,
                                'total_expenses' => $total,
                                'completed'      => $comp
                            ]);

        $finances = new FinancesController();
        $finances->update();

        return back();
    }

    public function destroy(Project $project)
    {
        // get expenses & delete 
        $expenses = Expense::where('project_id', $project->id)
                            ->get();

        // delete all expenses if any
        if ($expenses->count() > 0) {
            foreach ($expenses as $expense) {
                $expense->delete();
            }
        }
        
        // delete the project 
        $project->delete();

        $this->index();

        $finances = new FinancesController();
        $finances->update();

        return redirect('/projects');
    }

    public function destroyCycleProject(Project $project)
    {
        // get expenses & delete 
        $expenses = Expense::where('project_id', $project->id)
                            ->get();

        // delete all expenses if any
        if ($expenses->count() > 0) {
            foreach ($expenses as $expense) {
                $expense->delete();
            }
        }

        // delete the project 
        $project->delete();

        $finances = new FinancesController();
        $finances->update();

        return back();
    }

    public function getProject($id)
    {
        $project    = Project::where('id', $id)
            ->with('expenses')
            ->first();

        return $project;
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

    // API CALLS 
    public function getProjectsOrder($to, $id) 
    {
        $projects = Project::orderBy($to, $id)
                            ->get();

        return [$projects, $id];
    }

    public function getCycleProjectsOrder(Cycle $cycle)
    {
        $projects = Project::where('cycle_id', $cycle->id)->orderBy('created_at', 'desc')
            ->get();

        return [$projects];
    }
}
