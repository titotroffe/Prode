<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Torneo extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'tipo', 'creador_id', 'codigo_invitacion'];

    public function creador()
    {
        return $this->belongsTo(User::class, 'creador_id');
    }

    public function participantes()
    {
        return $this->belongsToMany(User::class, 'torneo_user')->withTimestamps();
    }
}
