<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Song;

class SongsController extends Controller
{
    // Add new entry to 'songs' table
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

    // Remove entry from 'songs' table
    public function delete($id)
    {
        $song = Song::findOrFail($id);
        $song->delete();

        return response()->json('Deleted succesfully', 200);
    }

    // Show a single song
    public function showOneSong($id)
    {
        $song = Song::find($id);
        return response()->json($song, 200);
    }

    // Show all songs
    public function showAllSongs()
    {
        $songs = Song::all();
        return response()->json($songs, 200);
    }

    // Add a musician to a song (add entry 'plays' table)
    public function addUserToSong($user_id, $song_id, $instrument)
    {
        $song = Song::find($song_id);

        $song->players()->attach($user_id, ['instrument' => $instrument]);

        return response()->json('Added succesfully', 201);
    }

    // Remove a musician from a song (remove entry 'plays' table)
    public function removeUserFromSong($user_id, $song_id)
    {
        $song = Song::find($song_id);

        $song->players()->detach($user_id);
        return response()->json('Removed succesfully', 200);
    }

    // Add a singer to a song (add entry 'can_sing' table)
    public function addSingerToSong($user_id, $song_id, $yes_or_maybe)
    {
        $song = Song::find($song_id);

        $song->players()->attach($user_id, ['yes_or_maybe' => $yes_or_maybe]);

        return response()->json('Added succesfully', 201);
    }

    // Remove a singer from a song (remove entry 'can_sing' table)
    public function removeSingerFromSong($user_id, $song_id)
    {
        $song = Song::find($song_id);

        $song->players()->detach($user_id);
        return response()->json('Removed succesfully', 200);
    }
}