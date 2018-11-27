import { Record } from 'immutable';

class Song extends Record({
  title: '', artist: '', spotify_link: '', comment: '', genre: '', vocals: '', backing: '', duet: '', players: [],
}) {
  hasPlayers(){
    return this.players.length > 0;
  }
}
export default Song;
