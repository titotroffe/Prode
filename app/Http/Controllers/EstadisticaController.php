<?php

namespace App\Http\Controllers;

use App\Models\Partido;
use App\Models\Equipo;
use App\Models\Gol;
use App\Models\Sancion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EstadisticaController extends Controller
{
    public function posiciones()
    {
        $equipos = Equipo::all()->keyBy('id')->map(function ($equipo) {
            $equipo->puntos = 0;
            $equipo->jugados = 0;
            $equipo->ganados = 0;
            $equipo->empatados = 0;
            $equipo->perdidos = 0;
            $equipo->goles_favor = 0;
            $equipo->goles_contra = 0;
            return $equipo;
        })->toArray();

        $partidos = Partido::where('estado', 'finalizado')->get();

        foreach ($partidos as $partido) {
            $local = &$equipos[$partido->equipo_local_id];
            $visitante = &$equipos[$partido->equipo_visitante_id];

            $local['jugados']++;
            $visitante['jugados']++;

            $local['goles_favor'] += $partido->resultado_local;
            $local['goles_contra'] += $partido->resultado_visitante;

            $visitante['goles_favor'] += $partido->resultado_visitante;
            $visitante['goles_contra'] += $partido->resultado_local;

            if ($partido->resultado_local > $partido->resultado_visitante) {
                $local['puntos'] += 3;
                $local['ganados']++;
                $visitante['perdidos']++;
            } elseif ($partido->resultado_local < $partido->resultado_visitante) {
                $visitante['puntos'] += 3;
                $visitante['ganados']++;
                $local['perdidos']++;
            } else {
                $local['puntos'] += 1;
                $visitante['puntos'] += 1;
                $local['empatados']++;
                $visitante['empatados']++;
            }
        }

        $posiciones = collect($equipos)->sortByDesc(function ($equipo) {
            return ($equipo['puntos'] * 1000) + ($equipo['goles_favor'] - $equipo['goles_contra']);
        })->values();

        return response()->json($posiciones);
    }

    public function goleadores()
    {
        $goleadores = Gol::with(['jugador', 'jugador.equipo'])
            ->select('jugador_id', DB::raw('SUM(cantidad) as total_goles'))
            ->groupBy('jugador_id')
            ->orderByDesc('total_goles')
            ->get();

        return response()->json($goleadores);
    }

    public function sancionados()
    {
        $sancionados = Sancion::with(['jugador', 'jugador.equipo'])
            ->where('estado', 'vigente')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($sancionados);
    }
}
