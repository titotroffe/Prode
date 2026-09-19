<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Partido;
use App\Models\Gol;
use App\Models\Jugador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminPartidoController extends Controller
{
    public function index()
    {
        // Return partidos pending or all, with their teams and jugadores for the lineup
        $partidos = Partido::with(['equipoLocal', 'equipoVisitante', 'jugadores'])->orderBy('fecha_kickoff', 'desc')->get();
        return response()->json($partidos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipo_local_id' => 'required|exists:equipos,id',
            'equipo_visitante_id' => 'required|exists:equipos,id|different:equipo_local_id',
            'fecha_kickoff' => 'required|date',
            'torneo_id' => 'nullable|exists:torneos,id',
            'jugadores' => 'nullable|array',
            'jugadores.*' => 'exists:jugadores,id'
        ]);

        $jugadoresPlanilla = collect($validated['jugadores'] ?? [])->unique();
        $jugadoresValidos = Jugador::query()
            ->whereIn('id', $jugadoresPlanilla)
            ->whereIn('equipo_id', [$validated['equipo_local_id'], $validated['equipo_visitante_id']])
            ->count();

        if ($jugadoresValidos !== $jugadoresPlanilla->count()) {
            return response()->json([
                'message' => 'La planilla solo puede incluir jugadores de los equipos del partido.',
            ], 422);
        }

        $partido = null;
        DB::transaction(function () use (&$partido, $validated) {
            $partido = Partido::create([
                'equipo_local_id' => $validated['equipo_local_id'],
                'equipo_visitante_id' => $validated['equipo_visitante_id'],
                'fecha_kickoff' => $validated['fecha_kickoff'],
                'torneo_id' => $validated['torneo_id'] ?? 1, // Torneo default si no hay
                'estado' => 'pendiente'
            ]);

            if (!empty($validated['jugadores'])) {
                $partido->jugadores()->sync($validated['jugadores']);
            }
        });

        return response()->json($partido->load(['equipoLocal', 'equipoVisitante', 'jugadores']), 201);
    }

    public function update(Request $request, Partido $partido)
    {
        $validated = $request->validate([
            'resultado_local' => 'required|integer|min:0',
            'resultado_visitante' => 'required|integer|min:0',
            'goles' => 'nullable|array', // array de [jugador_id, cantidad]
            'goles.*.jugador_id' => 'required|exists:jugadores,id',
            'goles.*.cantidad' => 'required|integer|min:1',
            'jugadores' => 'nullable|array',
            'jugadores.*' => 'exists:jugadores,id'
        ]);

        $jugadoresPartido = $validated['jugadores'] ?? $partido->jugadores()
            ->pluck('jugadores.id')
            ->all();

        if (!empty($validated['goles'])) {
            $goleadores = collect($validated['goles'])->pluck('jugador_id')->unique();
            $jugadoresValidos = Jugador::query()
                ->whereIn('id', $goleadores)
                ->whereIn('equipo_id', [$partido->equipo_local_id, $partido->equipo_visitante_id])
                ->pluck('id');

            if ($jugadoresValidos->count() !== $goleadores->count()
                || $goleadores->diff($jugadoresPartido)->isNotEmpty()) {
                return response()->json([
                    'message' => 'Cada goleador debe pertenecer a uno de los equipos y figurar en la planilla del partido.',
                ], 422);
            }
        }

        DB::transaction(function () use ($partido, $validated) {
            $partido->update([
                'resultado_local' => $validated['resultado_local'],
                'resultado_visitante' => $validated['resultado_visitante'],
                'estado' => 'finalizado',
            ]);

            // Eliminar goles previos para este partido y recrearlos
            Gol::where('partido_id', $partido->id)->delete();

            if (!empty($validated['goles'])) {
                foreach ($validated['goles'] as $golData) {
                    Gol::create([
                        'partido_id' => $partido->id,
                        'jugador_id' => $golData['jugador_id'],
                        'cantidad' => $golData['cantidad']
                    ]);
                }
            }

            if (isset($validated['jugadores'])) {
                $partido->jugadores()->sync($validated['jugadores']);
            }
        });

        return response()->json(['message' => 'Partido actualizado']);
    }
}
