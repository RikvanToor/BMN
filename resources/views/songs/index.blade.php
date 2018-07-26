@extends('layouts.app')

@section('content')
  <h1>Songs</h1>
  @if(count($songs) > 0)
    <table>
      <tr>
        <th>Title</th>
        <th>Artist</th>
        <th>Link</th>
        <th></th>
      </tr>

    @foreach($songs as $song)
      <tr>
        <td>{{$song->title}}</td>
        <td>{{$song->artist}}</td>
        <td><a href="{{$song->spotify_link}}">linkje</a></td>
        <td><a href="songs/delete/{{$song->id}}">delete</a></td>
      </tr>
    @endforeach
    </table>
  @else
    <p>No songs in database</p>
  @endif

  <a href="/songs/add">Add a song</a>
@endsection
