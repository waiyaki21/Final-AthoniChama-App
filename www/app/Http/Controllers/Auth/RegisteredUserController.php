<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use Illuminate\Auth\Events\Registered;
use App\Providers\RouteServiceProvider;
use App\Http\Controllers\FinancesController;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        $count = User::count();
        
        return Inertia::render('Auth/Register', [
            'name'      => env('APP_NAME'),
            'route'     => Route::current()->getName(),
            'users'     => $count,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        $users = User::get();

        // get ,create & update finances
        $finances = new FinancesController();
        $finances->store();
        
        if ($users->count() == 1) {
            return redirect('/settings');
        } else {
            return redirect('/dashboard');
        } 
    }
}
