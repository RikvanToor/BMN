export const SongActions = {
  GET_SONGS: 'GET_SONGS',
  GET_SONG: 'GET_SONG',
  UPDATE_SONG: 'UPDATE_SONG',
  UPDATE_SONGS: 'UPDATE_SONGS'
}

export function getSongsAction() {
  return { action: SongActions.GET_SONGS };
}

export function getSongAction(id) {
  return { action: SongActions.GET_SONG, id };
}

export function updateSongAction(song) {
  return { action: SongActions.UPDATE_SONG, song };
}

export function updateSongsAction(songs) {
  return { action: SongActions.UPDATE_SONGS, songs };
}