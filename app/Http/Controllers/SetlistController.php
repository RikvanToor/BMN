<?php

namespace App\Http\Controllers;

use App\Models\Song;
use Illuminate\Http\Request;
use App\Http\ResponseCodes;

class SetlistController extends Controller {
    public function addSetlistSong(Request $request){
        $this->validate($request, [
            'title'        => 'required',
            'artist'       => 'required',
        ]);

        $song = Song::create($request->all());
        $song->is_setlist = true;
        $song->save();
        
        return response()->json($song, 201);
    }

    public function getAllSetlistSongs(){
        $songs = Song::where('is_setlist','=',true)->with('players')->get();
        return response()->json($songs, ResponseCodes::HTTP_OK);
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
}