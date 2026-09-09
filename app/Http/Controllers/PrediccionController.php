<?php

namespace App\Http\Controllers;

use App\Models\Partido;
use App\Models\Prediccion;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PrediccionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'partido_id' => 'required|exists:partidos,id',
            'resultado_local_predicho' => 'required|integer|min:0',
            'resultado_visitante_predicho' => 'required|integer|min:0',
        ]);

        $partido = Partido::findOrFail($validated['partido_id']);

        // Regla de negocio: no se puede predecir si el partido ya empezó
        if (Carbon::now()->gte($partido->fecha_kickoff)) {
            return response()->json(['error' => 'El partido ya ha comenzado, no puedes cargar o editar la predicción.'], 403);
        }

        $prediccion = Prediccion::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'partido_id' => $partido->id,
            ],
            [
                'resultado_local_predicho' => $validated['resultado_local_predicho'],
                'resultado_visitante_predicho' => $validated['resultado_visitante_predicho'],
            ]
        );

        return response()->json($prediccion);
    }
}
