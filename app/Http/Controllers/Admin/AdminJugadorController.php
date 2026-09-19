<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Jugador;
use Illuminate\Http\Request;

class AdminJugadorController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipo_id' => 'required|exists:equipos,id',
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'dni' => 'nullable|string|max:20',
            'posicion' => 'nullable|string|max:50',
        ]);

        $jugador = Jugador::create($validated);
        
        // Cargar relación para retornar
        $jugador->load('equipo');
        
        return response()->json($jugador, 201);
    }

    public function update(Request $request, Jugador $jugador)
    {
        // Nota: Laravel nombra la variable singular 'jugadore' por defecto a veces si la ruta es /jugadores/{jugadore}, usamos $jugadore
        $validated = $request->validate([
            'equipo_id' => 'required|exists:equipos,id',
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'dni' => 'nullable|string|max:20',
            'posicion' => 'nullable|string|max:50',
        ]);

        $jugador->update($validated);
        
        $jugador->load('equipo');
        
        return response()->json($jugador);
    }

    public function destroy(Jugador $jugador)
    {
        $jugador->delete();
        return response()->json(['message' => 'Jugador eliminado correctamente']);
    }
}
