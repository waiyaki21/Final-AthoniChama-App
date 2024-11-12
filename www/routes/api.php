<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CycleController;
use App\Http\Controllers\CycleExpenseController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('api')->controller(DashboardController::class)->group(function () {
    // get cycle info
    Route::get('/getCyclesInfo', 'CyclesInfo');
    // get end cycle info for list
    Route::get('/getNextCyclesInfo/{cycle}', 'EndCyclesInfo');
    // get no of ledger cycles
    Route::get('/getCyclesNo/{from}/{to}', 'getCyclesNo');
    // get prev URL
    Route::get('/urlPrev', 'urlPrev');
});

Route::middleware('api')->controller(ProjectController::class)->group(function () {
    // get projects
    Route::get('/getProjects/{to}/{id}', 'getProjectsOrder');
    // get projects
    Route::get('/getCycleProjects/{cycle}', 'getCycleProjectsOrder');
});

Route::middleware('api')->controller(ExpenseController::class)->group(function () {
    // get expenses
    Route::get('/getExpenses/{project}', 'getExpenses');
});

Route::middleware('api')->controller(CycleExpenseController::class)->group(function () {
    // get cycle expenses
    Route::get('/getCycleExpenses/{cycle}', 'getCycleExpenses');
    // get all cycle expenses
    Route::get('/getAllCycleExpenses', 'getAllCycleExpenses');
});

Route::middleware('api')->controller(CycleController::class)->group(function () {
    // get cycles
    Route::get('/getCycles/{to}/{id}', 'getCyclesOrder');

    // get cycles year
    Route::get('/getCyclesBy/year/{id}', 'getCyclesOrderYear');

    // get cycles months
    Route::get('/getCyclesBy/month/{id}', 'getCyclesOrderMonth');

    // get cycle info
    Route::get('/getCycle/{cycle}', 'getCycleInfo');

    // get cycles' payments
    Route::get('/getPayments/{cycle}/{to}/{id}', 'getPaymentsOrder');

    // get cycles' welfares
    Route::get('/getWelfares/in/{cycle}', 'getWelfaresIn');
    Route::get('/getWelfares/out/{cycle}', 'getWelfaresOut');
});

Route::middleware('api')->controller(MemberController::class)->group(function () {
    // get member
    Route::get('/getMember/info/{member}', 'getMember');

    // get new  member order
    Route::get('/getMember/new', 'getMemberNew');

    // search members 
    Route::get('/searchMembers/{search}', 'searchMembers');

    // get members order
    Route::get('/getMembers/{to}/{id}', 'getMembersOrder');
    // Route::get('/getMembers/paginate/{to}/{id}', 'getMembersOrderPaginate');

    // get members payments order
    Route::get('/getPays/member/{member}/{to}/{id}', 'getMembersPays');

    // get members payments per cycle
    Route::get('/getPays/member/{member}/{cycle}', 'getCyclePays');
});

Route::middleware('api')->controller(SettingController::class)->group(function () {
    // check if settings
    Route::get('/isSettings', 'isSettings');
    // get settings 
    Route::get('/getSettings', 'getSettings');
});
