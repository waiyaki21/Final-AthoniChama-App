<?php

use App\Http\Controllers\ExportSheetsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->controller(ExportSheetsController::class)->group(function () {
    // CYCLES
    // download sheet 
    Route::get('/download/current/{cycle}', 'exportCycle');
    // download cycle active/sheet 
    Route::get('/download/current/active/{cycle}', 'exportCycleActive');
    // download cycle All/sheet 
    Route::get('/download/current/all/{cycle}', 'exportCycleAll');
    // download cycle sheet template
    Route::get('/download/template/{cycle}', 'exportCycleTemplate');
    // download cycle sheet template full
    Route::get('/download/template/cycle/{year}', 'exportCycleTemplateFull');
    // download cycle sheet modal template full
    Route::get('/download/template/cycle/{month}/{year}', 'exportCycleTemplateModal');

    // MEMBERS
    // download member sheet template
    Route::get('/download/template/new/members', 'exportMemberTemplate');
    // download member sheet single member
    Route::get('/download/current/member/{member}', 'exportTemplateMember');

    // LEDGERS
    // download sheet ledger
    Route::get('/download/ledger', 'exportLedger');
    // download sheet ledger by year
    Route::get('/download/ledger/year/{year}', 'exportLedgerYear');
    // download sheet ledger by cycle
    Route::get('/download/ledger/cycle/{cycle}', 'exportLedgerCycle');
    // download sheet ledger by selection
    Route::get('/download/ledger/{from}/{to}', 'exportLedgerCycleSelection');
});
