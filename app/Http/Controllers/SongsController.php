<?php

namespace App\Http\Controllers;

use App\Models\Song;
use Illuminate\Http\Request;

class SongsController extends Controller {

    /**
     * Add new entry to 'songs' table
     */
    public function addSong(Request $request) {
        $this->validate($request, [
            'title'        => 'required',
            'artist'       => 'required',
            'genre'        => 'required',
            'spotify_link' => 'required',
        ]);
        // Create song and add it as a suggestion for the current user
        $song = $request->user()->suggestions()->create($request->all());
        return response()->json($song, 201);
    }

    /**
     * Remove entry from 'songs' table
     */
    public function delete($id) {
        $song = Song::findOrFail($id);
        $song->delete();

        return response()->json('Deleted succesfully', 200);
    }

    /**
     * Show a single song
     */
    public function showOneSong($id) {
        $song = Song::find($id);
        return response()->json($song, 200);
    }
    
    public function addSetlistSong(Request $request){
        $this->validate($request, [
            'title'        => 'required',
            'artist'       => 'required',
            'spotify_link' => 'required',
        ]);

        $song = Song::create($request->all());
        $song->is_setlist = true;
        
        return response()->json($song, 201);
    }
    
    /**
     * Promotes a single song to the setlist
     * @param Request $request
     * @return type
     */
    public function promoteSongToSetlist(Request $request){
        $validatedData = $this->validate($request, [
           'songid' => 'required|integer|exists:songs,id' 
        ]);
        $song = Song::findOrFail($validatedData['songid']);
        //
        $song->is_setlist = true;
        $song->setlist_order = 0;
        $song->save();
        
        return response()->json(array('songid'=>$validatedData['songid']), 200);
    }
    
    /**
     * Demotes a song from the setlist
     * @param Request $request
     * @return type
     */
    public function demoteSongFromSetlist(Request $request){
        $validatedData = $this->validate($request, [
           'songid' => 'required|integer|exists:songs,id' 
        ]);
        $song = Song::findOrFail($validatedData['songid']);
        //
        $song->is_setlist = false;
        $song->save();
        
        return response()->json(array('songid'=>$validatedData['songid']), 200);
    }

    /**
     * Show all songs
     */
    public function showAllSongs() {
        $songs = Song::all();
        return response()->json($songs, 200);
    }

    /**
     * Show all suggestions
     */
    public function showSuggestions() {
        $songs = Song::where('is_setlist', false)->get();
        return response()->json($songs, 200);
    }

    /**
     * Return all songs and the songs for the user of the request
     */
    public function showMySongsAndallSongs(Request $request) {
        $all = Song::where('is_published', true)->get();
        $mine = $request->user()->songs()->where('is_published', true)->get();
        $result = [
            'allSongs' => $all,
            'mySongs'  => $mine
        ];
        return response()->json($result, 200);
    }

    /**
     * Show the players of a specific song
     */
    public function showUsers($id) {
        $users = Song::find($id)->players()->get();
        return response()->json($users, 200);
    }

    /**
     * Get a song identified by a given id. Add players under name 'players'
     */
    public function showSongWithUsers($id) {
        $song = Song::with('players')->find($id);
        return response()->json($song, 200);
    }

    /**
     * Add a musician to a song (add entry 'plays' table)
     */
    public function addUserToSong($id, $user_id, $instrument) {
        $song = Song::find($id);

        $song->players()->attach($user_id, ['instrument' => $instrument]);

        return response()->json('Added succesfully', 201);
    }

    /**
     * Remove a musician from a song (remove entry 'plays' table)
     */
    public function removeUserFromSong($user_id, $song_id) {
        $song = Song::find($song_id);

        $song->players()->detach($user_id);
        return response()->json('Removed succesfully', 200);
    }

    /**
     * Show a songs possible singers
     */
    public function showSingers($id) {
        $singers = Song::find($id)->singers()->get();
        return response()->json($singers, 200);
    }

    /**
     * Add a singer to a song (add entry 'can_sing' table)
     */
    public function addSingerToSong($user_id, $id, $yes_or_maybe) {
        $song = Song::find($id);

        $song->singers()->attach($user_id, ['yes_or_maybe' => $yes_or_maybe]);

        return response()->json('Added succesfully', 201);
    }

    /**
     * Remove a singer from a song (remove entry 'can_sing' table)
     */
    public function removeSingerFromSong($user_id, $id) {
        $song = Song::find($id);

        $song->singers()->detach($user_id);
        return response()->json('Removed succesfully', 200);
    }

    /**
     * Show songs with genre
     */
    public function showGenre($genre) {
        $songs = Song::where('genre', $genre);
        return response()->json($songs, 200);
    }
}
