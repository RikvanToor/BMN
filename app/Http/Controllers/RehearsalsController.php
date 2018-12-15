<?php

namespace App\Http\Controllers;

use App\Models\Rehearsal;
use App\Models\Song;
use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;

class RehearsalsController extends Controller {
    private static function now(){
        return date('Y-m-d H:i:s');
    }
    /**
     * Add entry to 'rehearsals' table
     */
    public function create(Request $request) {
        $this->validate($request, [
            'location' => 'required',
            'start'    => 'required|date',
            'end'      => 'required|date',
        ]);

        $rehearsal = Rehearsal::create($request->all());
        return response()->json($rehearsal, 201);
    }
    
    
    public function deleteRehearsal(Request $request, $id){
        Rehearsal::destroy($id);
        return response()->json(array('id'=>$id),200);
    }
    
    public function deleteRehearsals(Request $request){
        $validatedData = $this->validate($request, [
            'ids'=>'required|array'
        ]);
        Rehearsal::destroy($validatedData['ids']);
        
        return response()->json($validatedData,200);
    }
    
    /**
     * Create multiple rehearsals simultaneous. Requires an array
     * structure in the request with key 'rehearsals' containing
     * objects with keys 'location','start' and 'end'.
     */
    public function createMultiple(Request $request){
    
        $validatedData = $this->validate($request,[
            'rehearsals.*.location' => 'required',
            'rehearsals.*.start'    => 'required|date',
            'rehearsals.*.end'      => 'required|date',
        ]);
        
        //Create all rehearsals
        $rehearsals = [];
        foreach($validatedData['rehearsals'] as $elem){
            $rehearsals[] = Rehearsal::create($elem);
        }
        //Send created rehearsals
        return response()->json($rehearsals, 201);
    }

    /**
     * Get every rehearsal that ends after this very moment.
     */
    public function showFutureRehearsals() {
        $rehearsals = Rehearsal::where('end', '>=', now())->get();
        return response()->json($rehearsals, 200);
    }
    
    /**
     * Get every rehearsal that ends after this very moment including songs and players.
     */
    public function showFutureRehearsalsWithSchedule() {
        $rehearsals = Rehearsal::where('end', '>=', date('Y-m-d H:i:s'))->get();
        $result = $rehearsals->map(function ($x) {
            return $x->schedule();
        });
        return response()->json($result, 200);
    }

    /**
     * Get every rehearsal that ends after this very moment including songs and players 
     * that a given player plays.
     */
    public function showFutureRehearsalsWithScheduleForPlayer($playerid) {
        $rehearsals = Rehearsal::where('end', '>=', date('Y-m-d H:i:s'))->get();
        $result = $rehearsals->map(function ($x) use ($playerid){
            return $x->scheduleForPlayer($playerid);
        });
        return response()->json($result, 200);
    }

    /**
     * Get every rehearsal that starts after this very moment end return the availabilities
     * for the current user for those rehearsals
     */
    public function showFutureRehearsalsOwnAvailabilities(Request $request) {
        $rehearsals = Rehearsal::where('start', '>=', date('Y-m-d H:i:s'));
        $userid = $request->user()->id;
        $result = $rehearsals->with(['availabilities' => function ($a) use ($userid) {
            $a->where('user_id', $userid);
        }]);
        return response()->json($result->get(), 200);
    }
    
    public function showFutureRehearsalsWithAvailabilities(Request $request){
        $rehearsals = Rehearsal::inFuture(); //Use scope
        $rehearsals = $rehearsals->with(['availabilities'])->get(array('*'));
        $result = $rehearsals->map(function ($x){
            return $x->schedule();
        });
        return response()->json($result, 200);
    }

    public function saveAvailabilities($id, Request $request) {
        $rehearsal = Rehearsal::findOrFail($id);
        $userid = $request->user()->id;
        $availabilities = $rehearsal->availabilities();
        // Delete old availabilities
        $availabilities->wherePivot('user_id', $userid)->detach();
        
        $validatedData = $this->validate($request,[
            'reason' => 'string',
            'starts'    => 'array',
            'ends'      => 'array',
        ]);

        
        if(!array_key_exists('starts', $validatedData) || count($validatedData['starts']) == 0) {
            $availabilities->attach($userid, [
                'reason' => $validatedData['reason'],
                'start' => NULL,
                'end' => NULL
            ]);
        }
        else {
            $starts = $validatedData['starts'];
            $ends = $validatedData['ends'];
            for($i = 0; $i < count($starts); $i++) {
                $availabilities->attach($userid, [
                    'reason' => NULL,
                    'start' => $starts[$i],
                    'end' => $ends[$i]
                ]);
            }
        }
        return response()->json('success', 200);
    }

    /**
     * Find a rehearsal and return it with its songs with their players.
     */
    public function showRehearsalWithSchedule($id) {
        $rehearsal = Rehearsal::findOrFail($id);
        return response()->json($rehearsal->schedule(), 200);
    }
    
    public function setSongs($id, Request $request){
        $rehearsal = Rehearsal::findOrFail($id);
        $validatedData = $this->validate($request, [
            'songs.*.id' => 'required',
            'songs.*.start' => 'required|date|after_or_equal:' . $rehearsal->start,
            'songs.*.end' => 'required|date|before_or_equal:' . $rehearsal->end,
        ]);

        //Remove old songs
        $rehearsal->songs()->detach();
        
        //TODO maybe again check here that songs do not overlap.

        foreach($validatedData['songs'] as $elem){
            //Make sure the song exists
            $song = Song::findOrFail($elem["id"]);
            //Attach the song
            $rehearsal->songs()->attach($elem['id'], [
               'start'=>$elem['start'],
               'end'=>$elem['end']
            ]);
        }
        //Send created rehearsals
        return response()->json($rehearsal, 201);
    }

    public function addSong($id, Request $request) {
        $rehearsal = Rehearsal::findOrFail($id);
        $this->validate($request, [
            'song_id' => 'required',
            'start'   => 'required|date|after_or_equal:' . $rehearsal->start,
            'end'     => 'required|date|before_or_equal:' . $rehearsal->end,
        ]);
        $data = $request->all();
        // Make sure the song exists
        $song = Song::findOrFail($data['song_id']);
        $rehearsal->songs()->attach($data['song_id'], [
            'start' => $data['start'],
            'end'   => $data['end'],
        ]);

        return response()->json('Added succesfully', 201);
    }

    public function removeSong($id, $song_id) {
        $rehearsal = Rehearsal::findOrFail($id);
        $rehearsal->songs()->detach($song_id);
        return response()->json('Removed succesfully', 200);
    }
}
