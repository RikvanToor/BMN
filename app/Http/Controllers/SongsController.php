<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Song;
use DB;

class SongsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function index()
    {
        $songs = Song::orderBy('created_at', 'asc')->paginate(10);
        return view('songs.index')->with('songs', $songs);
    }

    public function create()
    {
        return view('songs.add');
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'title' => 'required',
            'artist' => 'required',
            'spotify_link' => 'required'
        ]);

        //Create
        $song = new Song;
        $song->title = $request->input('title');
        $song->artist = $request->input('artist');
        $song->spotify_link = $request->input('spotify_link');
        $song->save();

        return redirect('/songs');
    }

    public function show($id)
    {
        $song = Song::find($id);
        return view('songs.song')->with('song', $song);
    }

    public function destroy($id)
    {
        $song = Song::find($id);
        $song->delete();

        return redirect('/songs');
    }
}