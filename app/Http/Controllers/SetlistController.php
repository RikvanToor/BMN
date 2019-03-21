<?php

namespace App\Http\Controllers;

use App\Models\Song;
use Illuminate\Http\Request;
use App\Http\ResponseCodes;
use DB;

class SetlistController extends Controller {
    public function addSetlistSong(Request $request){
        $this->validate($request, [
            'title'        => 'required',
            'artist'       => 'required',
        ]);
        
        $data = $request->all();
        $data['is_setlist'] = true;
        $song = Song::create($data);

        // Need to retrieve it from the database again because of some typing issues
        // Likely a bug in Lumen/Eloquent
        $song2 = Song::with('players')->find($song->id);
        
        return response()->json($song2, 201);
    }

    /**
     * Sets players for a selected setlist song.
     * @param integer $id  The ID of the song to update
     */
    public function updateSongPlayers($id, Request $request){
        $data = $this->validate($request, [
            'players.*.id' => 'required|integer',
            'players.*.instrument' => 'required'
        ]);

        //Empty array was given, so we want to delete all players
        if(!array_key_exists('players', $data)){
            $data['players'] = [];
        }
        $song = Song::findOrFail($id);
        //Clear previous players
        $song->players()->detach();
        //Get appropriate structured data
        $toAttach = array_reduce($data['players'], function($accum, $value){
            $accum[$value['id']] = ['instrument' => $value['instrument']];
            return $accum;
        },array());
        
        //If new players are available, attach them
        if(count($data['players']) > 0){
            //Attach new players
            $song->players()->attach($toAttach);
        }

        //Save and respond
        $song->save();
        return response()->json($song->players()->get(), ResponseCodes::HTTP_OK);
    }

    /**
     * Publishes the songs for which the IDs are given. These setlist songs
     * are now visible for all participants.
     */
    public function publishSongs(Request $request){
        $validatedData = $this->validate($request,[
            'ids' => 'array|required',
            'ids.*' => 'integer'
        ]);

        //Update the songs
        Song::whereIn('id',$validatedData['ids'])->where('is_setlist','=',1)->update(['is_published' => 1]);

        return response()->json($validatedData['ids'], ResponseCodes::HTTP_OK);
    }

    /**
     * Retrieves all setlist songs
     */
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
     * Deletes a setlist song
     */
    public function deleteSetlistSong(Request $request, $id){
        $song = Song::findOrFail($id);
        $song->players()->detach();
        $song->delete();
        return response()->json(array('msg'=>'Setlist nummer verwijderd'), ResponseCodes::HTTP_OK);
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