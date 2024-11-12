<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\ArtisanController;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use App\Providers\RouteServiceProvider;
use App\Http\Requests\Auth\LoginRequest;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create()
    {
        $count = User::count();

        if ($count == 0) {
            return redirect('/register');
        } else {
            return Inertia::render('Auth/Login', [
                'canResetPassword'  => Route::has('password.request'),
                'status'            => session('status'),
                'users'             => $count
            ]);
        }
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        // backup DB 
        $backupDB = new ArtisanController();
        $backupDB->backupDB();

        $request->session()->regenerate();

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // backup DB 
        $backupDB = new ArtisanController();
        $backupDB->backupDB();
        
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
