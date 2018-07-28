<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UsersController extends Controller
{
    // Add entry to 'users' table
    public function create(Request $request)
    {
        $this->validate($request, [
            'name' => 'required',
            'email' => 'required',
            'username' => 'required',
            'password' => 'required'
        ]);

        $user = User::create($request->all());
        return response()->json($user, 201);
    }

    // Remove entry from 'users' table
    public function delete($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json('Deleted succesfully', 200);
    }

    // Show one user
    public function showOneUser($id)
    {
        $user = User::find($id);
        return response()->json($user, 200);
    }

    // Show all users
    public function showAllUsers()
    {
        $users = User::all();
        return response()->json($users, 200);
    }

    // Show user's songs ordered by title
    public function showUserSongs($id)
    {
        $songs = User::find($id)->songs()->orderBy('title')->get();
        return response()->json($songs, 200);
    }
}