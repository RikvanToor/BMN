import { Store } from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';
import { List, Record } from 'immutable';

import {SongActions, updateSongsAction, updateSongAction, updateErrorAction} from '@Actions/SongActions.js';
import Song from '@Models/Song.js';
import {withKeys} from '@Utils/ObjectUtils.js';

const Endpoints = {
  getSongs: 'songs/mineAndAll',
  getSong: id => 'songs/' + id + '/withusers'
};

/**
 * Stores retrieved data with respect to rehearsals
 */
class SongsStore extends Store {
  // Pass global dispatcher to parent class
  constructor(dispatcher) {
    super(dispatcher);

    //All songs
    this.songs = new List();
    //Songs the current user plays
    this.mySongs = new List();
    //One specific song
    this.song = new Song;

    // Possible errors
    this.error = undefined;
  }

  static songFromResponse(songObj){
    let song = new Song(withKeys(songObj,['id','title','artist','genre', 'spotify_link']));
                   
    return song;
  }

  /**
     * Override of base class that is called when handling actions. Remember to not
     * dispatch new actions in this function.
     * @param {object} payload
     */
  __onDispatch(payload) {
    switch (payload.action) {
      case SongActions.ADD_SONG:
        this.song = SongsStore.songFromResponse(payload.responseData);
        this.__emitChange();
      break;
      case SongActions.GET_SONGS:
        AppDispatcher.dispatchPromisedFn(
          ApiService.readAuthenticatedData(Endpoints.getSongs, {}),
          data => updateSongsAction(data),
          (errData) => {
            this.error = errData;
          },
        );
        break;
      case SongActions.UPDATE_SONGS:
        if (payload.songs) {
          this.error = undefined;
          this.songs = new List(payload.songs.allSongs);
          this.mySongs = new List(payload.songs.mySongs);
          this.__emitChange();
        }
        break;
      case SongActions.GET_SONG:
        AppDispatcher.dispatchPromisedFn(
          ApiService.readAuthenticatedData(Endpoints.getSong(payload.id), {}),
          data => updateSongAction(data),
          (errData) => updateErrorAction()
        );
        break;
      case SongActions.UPDATE_SONG:
        if (payload.song) {
          this.error = undefined;
          this.song = payload.song;
          this.__emitChange();
        }
        break;
      case SongActions.UPDATE_ERROR:
        if (payload.error) {
          this.error = payload.error;
          this.__emitChange();
        }
      default:
        break;
    }
  }
}

export default new SongsStore(AppDispatcher);
