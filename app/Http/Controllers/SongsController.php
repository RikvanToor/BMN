<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Song;

class SongsController extends Controller
{

    public function showAllSongs()
    {
        $songs = Song::all();
        return response()->json($songs, 200);
    }


    public function create(Request $request)
    {
        $this->validate($request, [
            'title' => 'required',
            'artist' => 'required',
            'spotify_link' => 'required'
        ]);

        $song = Song::create($request->all());
        return response()->json($song, 201);
    }

    public function showOneSong($id)
    {
        $song = Song::find($id);
        return response()->json($song, 200);
    }

    public function delete($id)
    {
        $song = Song::findOrFail($id);
        $song->delete();

        return response()->json('Deleted succesfully', 200);
    }
}