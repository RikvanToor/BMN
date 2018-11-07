<?php

namespace App\Http\Controllers;

use App\Models\Rehearsal;
use App\Models\Song;
use Illuminate\Http\Request;

class RehearsalsController extends Controller {
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

    /**
     * Get every rehearsal that ends after this very moment.
     */
    public function showFutureRehearsals() {
        $rehearsals = Rehearsal::where('end', '>=', date('Y-m-d H:i:s'))->get();
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
     * Find a rehearsal and return it with its songs with their players.
     */
    public function showRehearsalWithSchedule($id) {
        $rehearsal = Rehearsal::findOrFail($id);
        return response()->json($rehearsal->schedule(), 200);
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
