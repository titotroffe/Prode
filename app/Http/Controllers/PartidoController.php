<?php

namespace App\Http\Controllers;

use App\Models\Partido;
use Illuminate\Http\Request;

class PartidoController extends Controller
{
    public function index(Request $request)
    {
        $partidos = Partido::with(['equipoLocal', 'equipoVisitante'])
            ->orderBy('fecha_kickoff', 'asc')
            ->get();

        // Adjuntar la predicción del usuario autenticado a cada partido
        $userId = $request->user()->id;
        
        $partidos->transform(function($partido) use ($userId) {
            $prediccion = $partido->predicciones()->where('user_id', $userId)->first();
            $partido->mi_prediccion = $prediccion;
            
            // Si el partido ya finalizó, también enviamos TODAS las predicciones
            // Esto servirá para que el front las muestre en el detalle de un torneo.
            if ($partido->estado === 'finalizado') {
                $partido->load(['predicciones.user']);
            }
            
            return $partido;
        });

        return response()->json($partidos);
    }

    public function update(Request $request, Partido $partido)
    {
        // Solo el admin puede hacer esto
        if (!$request->user()->is_admin) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'resultado_local' => 'required|integer|min:0',
            'resultado_visitante' => 'required|integer|min:0',
        ]);

        $partido->update([
            'resultado_local' => $validated['resultado_local'],
            'resultado_visitante' => $validated['resultado_visitante'],
            'estado' => 'finalizado',
        ]);

        // Despachar Job para calcular puntajes
        \App\Jobs\CalcularPuntajesJob::dispatch($partido);

        return response()->json($partido);
    }
}
