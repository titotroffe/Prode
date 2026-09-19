<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sancion;
use Illuminate\Http\Request;

class AdminSancionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'jugador_id' => 'required|exists:jugadores,id',
            'motivo' => 'required|string',
            'fechas_suspension' => 'required|integer|min:1',
        ]);

        $sancion = Sancion::create($validated);
        return response()->json($sancion, 201);
    }

    public function update(Request $request, Sancion $sancion)
    {
        $validated = $request->validate([
            'estado' => 'required|in:vigente,cumplida',
        ]);

        $sancion->update($validated);
        return response()->json($sancion);
    }

    public function destroy(Sancion $sancion)
    {
        $sancion->delete();
        return response()->json(['message' => 'Sanción eliminada']);
    }
}
