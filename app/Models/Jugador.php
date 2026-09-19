<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jugador extends Model
{
    use HasFactory;

    protected $table = 'jugadores';

    protected $fillable = [
        'equipo_id',
        'nombre',
        'apellido',
        'dni',
        'posicion',
    ];

    public function equipo()
    {
        return $this->belongsTo(Equipo::class);
    }

    public function goles()
    {
        return $this->hasMany(Gol::class);
    }

    public function partidos()
    {
        return $this->belongsToMany(Partido::class, 'jugador_partido')->withTimestamps();
    }

    public function sanciones()
    {
        return $this->hasMany(Sancion::class);
    }
}
