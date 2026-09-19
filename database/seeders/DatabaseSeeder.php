<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Equipo;
use App\Models\Torneo;
use App\Models\Partido;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Equipos Reales con sus escudos
        $nombresEquipos = [
            'Somisa' => 'Somisa.png', 
            'Regatas' => 'regatas.png', 
            '12 de Octubre' => '12deoct.png', 
            'San Martín' => 'sanmartin.png',
            'Defensores' => 'Defe.png', 
            'Matienzo' => 'Matienzo.png', 
            'Fútbol SN' => 'FSN.png', 
            'Gral. Rojo' => 'generalrojo.png',
            'Conesa' => 'Conesa.png', 
            'Belgrano' => 'Belgrano.png', 
            'Social' => 'SOCIAL.png', 
            'Los Andes' => 'losandes.png',
            'La Emilia' => 'LaEmilia.png', 
            'Argentino Oeste' => 'ArgOeste.png', 
            'Paraná' => 'parana.png', 
            'El Fortín' => 'elfortin.png'
        ];

        $equipos = [];
        foreach ($nombresEquipos as $nombre => $escudo) {
            $equipos[$nombre] = Equipo::create([
                'nombre' => $nombre,
                'escudo' => $escudo
            ]);
        }

        // 2. Torneo General
        $torneoGeneral = Torneo::create([
            'nombre' => 'Torneo General',
            'tipo' => 'general',
            'creador_id' => null,
            'codigo_invitacion' => null,
        ]);

        // 3. Usuario Admin
        $admin = User::create([
            'name' => 'Admin Prode',
            'email' => 'admin@prode.local',
            'password' => Hash::make('password'),
            'equipo_hincha_id' => $equipos['Somisa']->id,
            'is_admin' => true,
        ]);
        $admin->torneos()->attach($torneoGeneral->id);

        $testUser = User::create([
            'name' => 'Usuario Test',
            'email' => 'test@prode.local',
            'password' => Hash::make('password'),
            'equipo_hincha_id' => $equipos['Regatas']->id,
            'is_admin' => false,
        ]);
        $testUser->torneos()->attach($torneoGeneral->id);

        // 4. Partidos (Fecha 1)
        $paresFecha1 = [
            ['Somisa', 'Regatas'],
            ['12 de Octubre', 'San Martín'],
            ['Defensores', 'Matienzo'],
            ['Fútbol SN', 'Gral. Rojo'],
            ['Conesa', 'Belgrano'],
            ['Social', 'Los Andes'],
            ['La Emilia', 'Argentino Oeste'],
            ['Paraná', 'El Fortín'],
        ];

        // Fecha 1: El próximo domingo a las 15:00
        $kickoffFecha1 = Carbon::now()->next(Carbon::SUNDAY)->setTime(15, 0);
        
        foreach ($paresFecha1 as $par) {
            Partido::create([
                'equipo_local_id' => $equipos[$par[1]]->id, // Invertido, como pediste
                'equipo_visitante_id' => $equipos[$par[0]]->id, // Invertido
                'torneo_id' => $torneoGeneral->id,
                'fecha_kickoff' => $kickoffFecha1,
                'estado' => 'pendiente'
            ]);
        }

        $this->call([
            NoticiasJugadoresSeeder::class,
        ]);
    }
}
