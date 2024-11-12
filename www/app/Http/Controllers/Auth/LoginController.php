<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\FinancesController;

class LoginController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback1()
    {
        $user = Socialite::driver('google')->user();

        // Find or create the user in your database
        $authUser = User::where('google_id', $user->id)->first();

        if ($authUser) {
            // User exists, log them in
            Auth::login($authUser);
        } else {
            // Create a new user
            $authUser = User::create([
                'name' => $user->name,
                'email' => $user->email,
                'google_id' => $user->id,
                // Add other necessary fields as needed
            ]);
            Auth::login($authUser);
        }

        return redirect()->to('/dashboard'); // Redirect to your desired route
    }

    public function handleGoogleCallback()
    {
        try {
            $user = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            return redirect('/login');
        }

        // Check if the user exists
        $existingUser = User::where('email', $user->getEmail())->first();

        if ($existingUser) {
            // Log the user in
            Auth::login($existingUser, true);
        } else {
            // Create a new user
            $newUser            = new User;
            $newUser->name      = $user->getName();
            $newUser->email     = $user->getEmail();
            $newUser->google_id = $user->getId();
            $newUser->password  = bcrypt(Str::random(16));
            $newUser->save();

            Auth::login($newUser, true);
        }

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
