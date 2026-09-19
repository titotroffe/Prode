<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Noticia;
use Illuminate\Http\Request;

class AdminNoticiaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string',
            'tipo' => 'required|in:noticia,efemeride',
            'imagen_url' => 'nullable|url',
        ]);

        $noticia = Noticia::create($validated);
        return response()->json($noticia, 201);
    }

    public function update(Request $request, Noticia $noticia)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string',
            'tipo' => 'required|in:noticia,efemeride',
            'imagen_url' => 'nullable|url',
        ]);

        $noticia->update($validated);
        return response()->json($noticia);
    }

    public function destroy(Noticia $noticia)
    {
        $noticia->delete();
        return response()->json(['message' => 'Eliminada correctamente']);
    }
}
