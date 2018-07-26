@extends('layouts.app')

@section('content')
  <h1>Add Song</h1>
  <form method="post" action="store">
    <input type="hidden" name="_method" value="POST">
      Title: <input type="text" name="title"><br>
      Artist: <input type="text" name="artist"><br>
      Link: <input type="text" name="spotify_link"><br>
    <input type="submit">
  </form>
@endsection