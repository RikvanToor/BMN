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

        $song = Song::create($request->all());
        $song->is_setlist = true;
        $song->save();
        
        return response()->json($song, 201);
    }

    /**
     * 
     */
    public function updateSongPlayers($id, Request $request){
        $data = $this->validate($request, [
            'players.*.id' => 'required|integer',
            'players.*.instrument' => 'required'
        ]);
        $song = Song::findOrFail($id);
        //Clear previous players
        $song->players()->detach();
        //Get appropriate structured data
        $toAttach = array_reduce($data['players'], function($accum, $value){
            $accum[$value['id']] = ['instrument' => $value['instrument']];
            return $accum;
        },array());
        //Attach new players
        $song->players()->attach($toAttach);
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