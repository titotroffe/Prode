<?php

namespace App\Http\Controllers;

use App\Models\Noticia;
use Illuminate\Http\Request;

class NoticiaController extends Controller
{
    public function index()
    {
        $noticias = Noticia::orderBy('fecha_publicacion', 'desc')->get();
        return response()->json($noticias);
    }

    public function show($id)
    {
        $noticia = Noticia::findOrFail($id);
        return response()->json($noticia);
    }
}
