<?php

namespace App\Jobs;

use App\Models\Partido;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CalcularPuntajesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $partido;

    /**
     * Create a new job instance.
     */
    public function __construct(Partido $partido)
    {
        $this->partido = $partido;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if ($this->partido->estado !== 'finalizado') {
            return;
        }

        $rl = $this->partido->resultado_local;
        $rv = $this->partido->resultado_visitante;

        // Determinar tendencia real: 1 (local gana), -1 (visitante gana), 0 (empate)
        $tendenciaReal = $rl <=> $rv;

        $predicciones = $this->partido->predicciones;

        foreach ($predicciones as $prediccion) {
            $pl = $prediccion->resultado_local_predicho;
            $pv = $prediccion->resultado_visitante_predicho;
            
            $tendenciaPredicha = $pl <=> $pv;

            $puntos = 0;

            if ($pl === $rl && $pv === $rv) {
                // Acierto exacto
                $puntos = 6;
            } elseif ($tendenciaReal === $tendenciaPredicha) {
                // Acierto de tendencia
                $puntos = 3;
            }

            $prediccion->puntos_obtenidos = $puntos;
            $prediccion->save();
        }
    }
}
