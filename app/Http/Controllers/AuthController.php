<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'equipo_hincha_id' => 'required|exists:equipos,id'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'apellido' => $validated['apellido'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'equipo_hincha_id' => $validated['equipo_hincha_id'],
        ]);

        // Asignar al torneo general
        $torneoGeneral = \App\Models\Torneo::where('tipo', 'general')->first();
        if ($torneoGeneral) {
            $user->torneos()->attach($torneoGeneral->id);
        }

        // Para SPA (cookies) hacemos login auto
        Auth::login($user);

        return response()->json([
            'user' => $user->load('equipoHincha')
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'login' => ['required', 'string'],
            'password' => ['required'],
        ]);

        $loginField = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        
        $credentials = [
            $loginField => $request->login,
            'password' => $request->password,
        ];

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return response()->json([
                'user' => Auth::user()->load('equipoHincha')
            ]);
        }

        throw ValidationException::withMessages([
            'login' => __('auth.failed'),
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('equipoHincha')
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'equipo_hincha_id' => 'required|exists:equipos,id',
            'current_password' => 'required_with:password|string',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user->name = $validated['name'];
        $user->apellido = $validated['apellido'];
        $user->equipo_hincha_id = $validated['equipo_hincha_id'];

        if (!empty($validated['password'])) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'message' => 'La contraseña actual es incorrecta'
                ], 422);
            }
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json([
            'user' => $user->load('equipoHincha'),
            'message' => 'Perfil actualizado exitosamente'
        ]);
    }
}
