import { Store } from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';
import { updateSongsAction, SongActions } from '@Actions/SongActions.js';
import { List } from 'immutable';

const Endpoints = {
  getSongs: 'songs/mineAndAll'
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

    // Possible errors
    this.error = undefined;
  }

  /**
     * Override of base class that is called when handling actions. Remember to not
     * dispatch new actions in this function.
     * @param {object} payload
     */
  __onDispatch(payload) {
    switch (payload.action) {
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
          this.songs = new List(payload.songs.allSongs);
          this.mySongs = new List(payload.songs.mySongs);
          this.__emitChange();
        }
        break;
      default:
        break;
    }
  }
}

export default new SongsStore(AppDispatcher);
