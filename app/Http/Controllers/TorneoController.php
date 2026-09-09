<?php

namespace App\Http\Controllers;

use App\Models\Torneo;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TorneoController extends Controller
{
    public function misTorneos(Request $request)
    {
        $user = $request->user();
        $torneos = $user->torneos;
        
        $torneos->transform(function ($torneo) use ($user) {
            $ranking = collect($this->calcularRanking($torneo->participantes));
            $torneo->top1 = $ranking->first();
            $torneo->mi_posicion = $ranking->firstWhere('user_id', $user->id);
            return $torneo;
        });

        return response()->json($torneos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255'
        ]);

        $codigo = Str::random(10);
        while(Torneo::where('codigo_invitacion', $codigo)->exists()) {
            $codigo = Str::random(10);
        }

        $torneo = Torneo::create([
            'nombre' => $validated['nombre'],
            'tipo' => 'privado',
            'creador_id' => $request->user()->id,
            'codigo_invitacion' => $codigo,
        ]);

        // Unir al creador automáticamente
        $torneo->participantes()->attach($request->user()->id);

        return response()->json($torneo, 201);
    }

    public function join(Request $request)
    {
        $validated = $request->validate([
            'codigo_invitacion' => 'required|string|exists:torneos,codigo_invitacion'
        ]);

        $torneo = Torneo::where('codigo_invitacion', $validated['codigo_invitacion'])->firstOrFail();

        // Evitar unirse si ya está
        if (!$torneo->participantes()->where('user_id', $request->user()->id)->exists()) {
            $torneo->participantes()->attach($request->user()->id);
        }

        return response()->json(['message' => 'Te has unido al torneo exitosamente', 'torneo' => $torneo]);
    }

    public function leave(Torneo $torneo, Request $request)
    {
        if ($torneo->tipo === 'general') {
            return response()->json(['error' => 'No puedes abandonar el torneo general'], 400);
        }

        if ($torneo->creador_id === $request->user()->id) {
            return response()->json(['error' => 'Sos el creador del torneo, no podés abandonarlo'], 400);
        }

        $torneo->participantes()->detach($request->user()->id);

        return response()->json(['message' => 'Has abandonado el torneo']);
    }

    public function rankingGeneral(Request $request)
    {
        $torneo = Torneo::where('tipo', 'general')->first();
        if(!$torneo) return response()->json(['top3' => [], 'mi_posicion' => null]);

        $ranking = collect($this->calcularRanking($torneo->participantes));
        
        $top3 = $ranking->filter(function ($item) {
            return $item['posicion'] <= 3;
        })->values();

        $miPosicion = $ranking->firstWhere('user_id', $request->user()->id);

        return response()->json([
            'top3' => $top3,
            'mi_posicion' => $miPosicion
        ]);
    }

    public function show(Torneo $torneo, Request $request)
    {
        // Validar que participe en el torneo
        if (!$torneo->participantes()->where('user_id', $request->user()->id)->exists()) {
            return response()->json(['error' => 'No participas en este torneo'], 403);
        }

        $ranking = $this->calcularRanking($torneo->participantes);

        return response()->json([
            'torneo' => $torneo,
            'ranking' => $ranking,
        ]);
    }

    private function calcularRanking($users)
    {
        $usersConPuntos = $users->map(function ($user) {
            $puntos = $user->predicciones()->sum('puntos_obtenidos');
            return [
                'user_id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'equipo_hincha' => $user->equipoHincha,
                'puntos' => $puntos,
            ];
        })->sortByDesc('puntos')->values();

        $ranking = [];
        $posicionActual = 1;
        $posicionVisual = 1;
        $puntosAnteriores = null;

        foreach ($usersConPuntos as $index => $u) {
            if ($puntosAnteriores === null) {
                // Primer elemento
                $puntosAnteriores = $u['puntos'];
            } elseif ($u['puntos'] < $puntosAnteriores) {
                // Baja de puntos, la posición visual salta al índice actual + 1
                $posicionVisual = $index + 1;
                $puntosAnteriores = $u['puntos'];
            }

            $u['posicion'] = $posicionVisual;
            $ranking[] = $u;
        }

        return $ranking;
    }
}
