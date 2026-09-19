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
Route::get('/jugadores', function () {
    // El DNI es un dato personal y no debe exponerse en el listado público.
    return response()->json(\App\Models\Jugador::query()
        ->select(['id', 'equipo_id', 'nombre', 'apellido', 'posicion'])
        ->orderBy('apellido')
        ->orderBy('nombre')
        ->get());
});

// Portal Noticias y Estadísticas (Públicas)
Route::get('/noticias', [\App\Http\Controllers\NoticiaController::class, 'index']);
Route::get('/noticias/{id}', [\App\Http\Controllers\NoticiaController::class, 'show']);
Route::get('/estadisticas/posiciones', [\App\Http\Controllers\EstadisticaController::class, 'posiciones']);
Route::get('/estadisticas/goleadores', [\App\Http\Controllers\EstadisticaController::class, 'goleadores']);
Route::get('/estadisticas/sancionados', [\App\Http\Controllers\EstadisticaController::class, 'sancionados']);
Route::get('/partidos', [PartidoController::class, 'index']); // Partidos (ahora público para el fixture)

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

    // Predicciones
    Route::post('/predicciones', [PrediccionController::class, 'store']); // Cargar/Editar
    // Admin Panel
    Route::middleware('is_admin')->prefix('admin')->group(function () {
        Route::post('/noticias', [\App\Http\Controllers\Admin\AdminNoticiaController::class, 'store']);
        Route::put('/noticias/{noticia}', [\App\Http\Controllers\Admin\AdminNoticiaController::class, 'update']);
        Route::delete('/noticias/{noticia}', [\App\Http\Controllers\Admin\AdminNoticiaController::class, 'destroy']);

        Route::get('/partidos', [\App\Http\Controllers\Admin\AdminPartidoController::class, 'index']);
        Route::post('/partidos', [\App\Http\Controllers\Admin\AdminPartidoController::class, 'store']);
        Route::put('/partidos/{partido}', [\App\Http\Controllers\Admin\AdminPartidoController::class, 'update']);

        Route::post('/sanciones', [\App\Http\Controllers\Admin\AdminSancionController::class, 'store']);
        Route::put('/sanciones/{sancion}', [\App\Http\Controllers\Admin\AdminSancionController::class, 'update']);
        Route::delete('/sanciones/{sancion}', [\App\Http\Controllers\Admin\AdminSancionController::class, 'destroy']);

        Route::post('/jugadores', [\App\Http\Controllers\Admin\AdminJugadorController::class, 'store']);
        Route::put('/jugadores/{jugador}', [\App\Http\Controllers\Admin\AdminJugadorController::class, 'update']);
        Route::delete('/jugadores/{jugador}', [\App\Http\Controllers\Admin\AdminJugadorController::class, 'destroy']);
    });
});
