<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partido extends Model
{
    use HasFactory;

    protected $fillable = [
        'equipo_local_id', 
        'equipo_visitante_id', 
        'torneo_id',
        'fecha_kickoff', 
        'resultado_local', 
        'resultado_visitante', 
        'estado'
    ];

    protected $casts = [
        'fecha_kickoff' => 'datetime',
    ];

    public function equipoLocal()
    {
        return $this->belongsTo(Equipo::class, 'equipo_local_id');
    }

    public function equipoVisitante()
    {
        return $this->belongsTo(Equipo::class, 'equipo_visitante_id');
    }

    public function predicciones()
    {
        return $this->hasMany(Prediccion::class);
    }

    public function torneo()
    {
        return $this->belongsTo(Torneo::class);
    }

    public function jugadores()
    {
        return $this->belongsToMany(Jugador::class, 'jugador_partido')->withTimestamps();
    }
}
