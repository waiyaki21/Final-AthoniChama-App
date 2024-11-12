<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArtisanController;
use App\Http\Controllers\CycleController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\UpdateController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\LedgersController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\WelfareController;
use App\Http\Controllers\FinancesController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ContributionsController;
use App\Http\Controllers\CycleExpenseController;
use App\Http\Controllers\CycleExpenseNamesController;
use App\Http\Controllers\NotificationController;

Route::get('/', function () {    
    return redirect('/dashboard');
})->middleware(['auth', 'verified']);


Route::middleware('auth')->controller(ArtisanController::class)->group(function () {
    // create cache
    Route::get('/cache', 'getCache');
    // bust cache
    Route::get('/bust', 'bustCache');
    // resetDB
    Route::get('/resetDB', 'resetDB');
});

Route::middleware('auth')->controller(DashboardController::class)->group(function () {
    // get dashboard
    Route::get('/dashboard', 'index')->name('Dashboard');

    Route::get('/DBbackup', 'downloadFile')->name('DB Backup');
});

Route::middleware('auth')->controller(ProfileController::class)->group(function () {
    // get
    Route::get('/profile', 'edit')->name('profile.edit');
    // update
    Route::patch('/profile', 'update')->name('profile.update');
    // delete
    Route::delete('/profile', 'destroy')->name('profile.destroy');
});

Route::middleware('auth')->controller(MemberController::class)->group(function () {
    // get all members 
    Route::get('/members', 'index')->name('Group Members');
    // get a member 
    Route::get('/member/{member}', 'show')->name('View Member');
    // post new member 
    Route::post('/member', 'store')->name('member');
    // edit member 
    Route::put('/update/member/{member}', 'update');
    // edit member active
    Route::get('/active/member/{member}', 'updateActive');
    // edit member modal many
    Route::put('/update/member/modal/{member}', 'updateModal');
    // delete member 
    Route::delete('/delete/member/{member}', 'destroy');
    // delete member and redirect to members
    Route::delete('/delete/member/reset/{member}', 'destroyReset');
    // delete all member 
    Route::get('/delete/all/members/', 'destroyAll');
    // post new excelsheet
    Route::post('/members/excel/add/', 'storeSheetMembers')->name('members excel');
    // clear welfare arrears
    Route::get('/clear/welfares/member/{member}', 'clearWelfare')->name('clear welfares');
});

Route::middleware('auth')->controller(CycleController::class)->group(function () {
    // get all cycles 
    Route::get('/cycles', 'index')->name('Payment Cycles');
    // get a cycle 
    Route::get('/cycle/{cycle}', 'show')->name('View Cycle Payments');
    // post new cycle 
    Route::post('/cycle', 'store')->name('cycle');
    // post new cycle excel
    Route::post('/cycle/excel', 'storeExcel')->name('cycle excel');
    // post new excelsheet
    Route::post('/cycle/excel/add/{cycle}', 'storeSheetCycle')->name('cycle excel add');
    // edit cycle 
    Route::put('/update/cycle/{cycle}', 'update')->name('cycleedit');
    // delete cycle 
    Route::delete('/delete/cycle/{cycle}', 'destroy');
    // delete cycle 
    Route::delete('/delete/cycle/reload/{cycle}', 'destroyReload');

    // check cycle existence
    Route::get('/cycle/exist/{month}/{year}', 'cycleExist')->name('cycle exist');
    // import ledger
    Route::post('/import/cycles/excel/{year}', 'storeCyclesLedger')->name('importCyclesLedger');
    // import cycle modal month year
    Route::post('/import/cycles/modal/{month}/{year}', 'storeCyclesModal')->name('importCyclesModal');
    // Route::post('/import/cycles/members/excel/{year}', 'storeLedgerMembers')->name('importLedgerMembers');
    // mass update all cycles
    Route::get('/mass/cycles/update', 'updateCycles');
    //get cycle payments order
    // clear balance
    Route::get('/clear/balance/{cycle}/{member}', 'clearBalance');
    // clear all balances
    Route::get('/clear/all/balances/{cycle}', 'clearAllBalances');
});

Route::middleware('auth')->controller(PaymentController::class)->group(function () {
    // get all payment 
    Route::get('/payments', 'index')->name('All Payments');
    // post new payment 
    Route::post('/payment/{cycle}', 'store')->name('payment');
    // post new payment from member
    Route::post('/payment/member/{member}', 'storeMember')->name('paymentMember');
    // edit payment 
    Route::put('/update/payment/{payment}', 'update')->name('paymentedit');
    // delete payment 
    Route::delete('/delete/payment/{payment}', 'destroy');
});

Route::middleware('auth')->controller(WelfareController::class)->group(function () {
    // edit welfare 
    Route::put('/update/welfare/{welfare}', 'update')->name('welfareedit');
    // delete welfare 
    Route::delete('/delete/welfare/{welfare}', 'destroy');
});

Route::middleware('auth')->controller(ProjectController::class)->group(function () {
    // get all projects 
    Route::get('/projects', 'index')->name('All Projects');
    // get a project 
    Route::get('/project/{project}', 'show')->name('View Project');
    // post new project 
    Route::post('/project', 'store')->name('project');
    // post new project excel
    Route::post('/project/excel', 'storeExcel')->name('project excel');
    // post new excelsheet
    Route::post('/project/excel/add/', 'storeSheetProject')->name('project excel add');
    // edit project 
    Route::put('/update/project/{project}', 'update')->name('projectedit');
    // delete project 
    Route::delete('/delete/project/{project}', 'destroy');
    // delete project 
    Route::delete('/delete/cycle/project/{project}', 'destroyCycleProject');
    // download sheet 
    Route::get('/download/project/{project}', 'export');
});

Route::middleware('auth')->controller(ExpenseController::class)->group(function () {
    // post new expense 
    Route::post('/expense/{project}', 'store')->name('expense');
    // edit expense 
    Route::put('/update/expense/{expense}', 'update')->name('expenseedit');
    // delete expense 
    Route::delete('/delete/expense/{expense}', 'destroy');
});

Route::middleware('auth')->controller(CycleExpenseController::class)->group(function () {
    // get all cycleExpense 
    Route::get('/cycleExpenses', 'index')->name('All CycleExpense');
    // get a cycleExpense 
    Route::get('/cycleExpense/{cycleExpense}', 'show')->name('View CycleExpense');
    // post new cycleExpense 
    Route::post('/cycleExpense/{cycle}', 'store')->name('CycleExpense');
    // post new cycleExpense excel
    Route::post('/cycleExpense/excel', 'storeExcel')->name('CycleExpense excel');
    // post new excelsheet
    Route::post('/cycleExpense/excel/add/', 'storeSheetCycleExpense')->name('CycleExpense excel add');
    // edit cycleExpense 
    Route::put('/update/cycleExpense/{cycleExpense}', 'update')->name('CycleExpenseedit');
    // delete cycleExpense 
    Route::delete('/delete/cycleExpense/{cycleExpense}', 'destroy');
    // delete cycleExpense from cycle page 
    Route::delete('/delete/cycle/cycleExpense/{cycleExpense}', 'destroyCycleExpense');
    // download sheet 
    Route::get('/download/cycleExpense/{cycleExpense}', 'export');
});

Route::middleware('auth')->controller(CycleExpenseNamesController::class)->group(function () {
    // post new cycleExpense 
    Route::post('/cycleExpenseName', 'store')->name('CycleExpenseName');
    // edit cycleExpense 
    Route::put('/update/cycleExpenseName/{cycleExpenseNames}', 'update')->name('CycleExpenseNameedit');
    // delete cycleExpense 
    Route::delete('/delete/cycleExpenseName/{cycleExpenseNames}', 'destroy');
    // delete cycleExpense from cycle page 
    Route::delete('/delete/cycle/cycleExpenseName/{cycleExpenseNames}', 'destroyCycleExpenseName');
});

Route::middleware('auth')->controller(FinancesController::class)->group(function () {
    // store finances 
    Route::get('/store/projects', 'store');
    // update finances 
    Route::get('/update/finances', 'update');
});

Route::middleware('auth')->controller(SettingController::class)->group(function () {
    // get settings
    Route::get('/settings', 'settings')->name('Admin Settings');
    // update settings 
    Route::put('/update/settings', 'update');
});

Route::middleware('auth')->controller(LedgersController::class)->group(function () {
    // get ledgers
    Route::get('/ledgers', 'index')->name('View Ledgers');
    // check ledger existence
    Route::get('/ledger/excel/exist/{year}', 'ledgerExist')->name('ledger exist');
    // get download templates
    Route::get('/ledger/getTemplates', 'getTemplates')->name('templates');
    // auto setup
    Route::get('/automatic/setup', 'uploadTemplates')->name('Auto Setup');
});

Route::middleware('auth')->controller(ContributionsController::class)->group(function () {
    // get contributions 
    Route::get('/contributions', 'index')->name('All Contributions');
});

Route::middleware('auth')->controller(UpdateController::class)->group(function () {
    // FULL DELETE 
    Route::get('/full_delete', 'deleteEverything')->name('FULL RESET');
    // update finances 
    Route::get('/reload/everything', 'reloadEverything')->name('FULL RELOAD');
});

Route::middleware('auth')->controller(NotificationController::class)->group(function () {
    // VIEW ALL 
    Route::get('/getNotifications', 'getNotifications')->name('allNotifications');
    // READ ALL 
    Route::get('/markAllAsRead', 'markAllAsRead')->name('readAll');
    // READ ALL 
    Route::get('/markAsRead/{id}', 'markAsRead')->name('read');
});

require __DIR__.'/auth.php';
require __DIR__ . '/ledger.php';
require __DIR__ . '/exports.php';
