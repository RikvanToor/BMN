<?php

namespace App\Http\Controllers;

use App\Models\Rehearsal;
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
     * Find a rehearsal and return it with its songs with their players.
     */
    public function showRehearsalWithSchedule($id) {
        $rehearsal = Rehearsal::findOrFail($id);
        return response()->json($rehearsal->schedule(), 200);
    }
}
