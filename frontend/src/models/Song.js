import { Record } from 'immutable';

class Song extends Record({
  title: '', artist: '', spotify_link: '', comment: '', genre: '', vocals: '', backing: '', duet: '', players: [],
}) {
}
export default Song;
