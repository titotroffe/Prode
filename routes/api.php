<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TorneoController;
use App\Http\Controllers\PartidoController;
use App\Http\Controllers\PrediccionController;

// Autenticación (SPA vía Sanctum)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Equipos base
Route::get('/equipos', function () {
    return response()->json(\App\Models\Equipo::all());
});

// Rutas protegidas (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    
    // Torneos
    Route::get('/torneos/general', [TorneoController::class, 'rankingGeneral']);
    Route::get('/torneos', [TorneoController::class, 'misTorneos']);
    Route::post('/torneos', [TorneoController::class, 'store']); // Crear privado
    Route::get('/torneos/{torneo}', [TorneoController::class, 'show']); // Ranking de torneo
    Route::post('/torneos/{torneo}/leave', [TorneoController::class, 'leave']); // Abandonar torneo
    Route::post('/torneos/join', [TorneoController::class, 'join']); // Unirse vía código

    // Partidos y Predicciones
    Route::get('/partidos', [PartidoController::class, 'index']); // Partidos para predecir
    Route::put('/partidos/{partido}', [PartidoController::class, 'update']); // Admin carga resultado
    Route::post('/predicciones', [PrediccionController::class, 'store']); // Cargar/Editar
});
