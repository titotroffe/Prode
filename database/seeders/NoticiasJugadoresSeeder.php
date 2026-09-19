<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Noticia;
use App\Models\Jugador;
use App\Models\Equipo;
use App\Models\Gol;
use App\Models\Sancion;
use App\Models\Partido;

class NoticiasJugadoresSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Noticias y Efemérides
        Noticia::create([
            'titulo' => 'Arranca el Torneo Apertura LNF',
            'contenido' => 'Este fin de semana arranca una nueva ilusión. Todos los equipos se preparan para la primera fecha del apasionante torneo de la Liga Nicoleña de Fútbol.',
            'tipo' => 'noticia',
            'fecha_publicacion' => now()->subDays(2),
        ]);

        Noticia::create([
            'titulo' => 'Efemérides: Hace 10 años, un campeón inolvidable',
            'contenido' => 'Recordamos hoy la hazaña de hace 10 años, cuando se coronó campeón invicto uno de los grandes de nuestra liga en un partido épico bajo la lluvia.',
            'tipo' => 'efemeride',
            'fecha_publicacion' => now()->subDays(1),
        ]);

        Noticia::create([
            'titulo' => 'Suspendida la fecha de inferiores',
            'contenido' => 'Debido a las fuertes lluvias, la liga decidió suspender toda la fecha de las categorías inferiores. La primera y reserva juegan con normalidad.',
            'tipo' => 'noticia',
            'fecha_publicacion' => now(),
        ]);

        // 2. Jugadores (Si existen equipos)
        $equipo1 = Equipo::first();
        $equipo2 = Equipo::skip(1)->first();

        if ($equipo1 && $equipo2) {
            $j1 = Jugador::create(['equipo_id' => $equipo1->id, 'nombre' => 'Lionel', 'apellido' => 'Perez', 'posicion' => 'Delantero']);
            $j2 = Jugador::create(['equipo_id' => $equipo1->id, 'nombre' => 'Emiliano', 'apellido' => 'Gomez', 'posicion' => 'Arquero']);
            $j3 = Jugador::create(['equipo_id' => $equipo2->id, 'nombre' => 'Angel', 'apellido' => 'Rodriguez', 'posicion' => 'Delantero']);
            $j4 = Jugador::create(['equipo_id' => $equipo2->id, 'nombre' => 'Nicolas', 'apellido' => 'Fernandez', 'posicion' => 'Defensor']);

            // 3. Sanciones
            Sancion::create([
                'jugador_id' => $j4->id,
                'motivo' => 'Roja directa por juego brusco',
                'fechas_suspension' => 2,
                'estado' => 'vigente'
            ]);

            // 4. Goles (si hay partidos)
            $partido = Partido::first();
            if ($partido) {
                Gol::create(['partido_id' => $partido->id, 'jugador_id' => $j1->id, 'cantidad' => 2]);
                Gol::create(['partido_id' => $partido->id, 'jugador_id' => $j3->id, 'cantidad' => 1]);
            }
        }
    }
}
