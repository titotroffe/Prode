<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sancion extends Model
{
    use HasFactory;

    protected $table = 'sanciones';

    protected $fillable = [
        'jugador_id',
        'motivo',
        'fechas_suspension',
        'estado',
    ];

    public function jugador()
    {
        return $this->belongsTo(Jugador::class);
    }
}
