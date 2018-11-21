<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UsersController extends Controller {
    /**
     * Add entry to 'users' table
     */
    public function create(Request $request) {
        $this->validate($request, [
            'name'     => 'required|unique:users',
            'email'    => 'required|email|unique:users',
            'username' => 'required|unique:users',
            'password' => 'required',
        ]);

        $properties = $request->all();
        $properties['password'] = app('hash')->make($request->get('password'));

        $user = User::create($properties);
        return response()->json($user, 201);
    }

    /**
     * Remove entry from 'users' table
     */
    public function delete($id) {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json('Deleted succesfully', 200);
    }

    /**
     * Show one user
     */
    public function showOneUser($id) {
        $user = User::find($id);
        return response()->json($user, 200);
    }

    /**
     * Show all users
     */
    public function showAllUsers() {
        $users = User::all();
        return response()->json($users, 200);
    }

    /**
     * Show user's songs ordered by title
     */
    public function showUserSongs($id) {
        $songs = User::find($id)->songs()->orderBy('title')->get();
        return response()->json($songs, 200);
    }

    /**
     * Show singer's possible songs
     */
    public function showSingerSongs($id) {
        $songs = User::find($id)->singingSongs()->orderBy('title')->get();
        return response()->json($songs, 200);
    }

    /**
     * Show singer's possible songs with genre
     */
    public function showSingerGenreSongs($id, $genre) {
        $songs = User::find($id)->singingSongs()->where('genre', $genre)->orderBy('title')->get();
        return response()->json($songs, 200);
    }
}
