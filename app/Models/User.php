<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'apellido', 'username', 'email', 'password', 'avatar', 'equipo_hincha_id', 'is_admin'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function equipoHincha()
    {
        return $this->belongsTo(Equipo::class, 'equipo_hincha_id');
    }

    public function torneos()
    {
        return $this->belongsToMany(Torneo::class, 'torneo_user')->withTimestamps();
    }

    public function torneosCreados()
    {
        return $this->hasMany(Torneo::class, 'creador_id');
    }

    public function predicciones()
    {
        return $this->hasMany(Prediccion::class);
    }
}
