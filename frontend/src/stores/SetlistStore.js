import { Store } from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';
import { List, Record } from 'immutable';

import {SetlistActions } from '@Actions/SetlistActions.js';
import SetlistSong from '@Models/SetlistSong.js';

/**
 * Stores retrieved data with respect to rehearsals
 */
class SetlistStore extends Store {
  // Pass global dispatcher to parent class
  constructor(dispatcher) {
    super(dispatcher);

    //All rehearsals
    this.setlist = new List();

    this.setlistSong = new SetlistSong;
  }

  /**
     * Override of base class that is called when handling actions. Remember to not
     * dispatch new actions in this function.
     * @param {object} payload
     */
  __onDispatch(payload) {
    switch (payload.action) {
        case SetlistActions.GET_SETLIST:
            if(payload.error){

            }
            else{
              this.setlist = new List(payload.responseData.map(el=>{
                //TODO add players
                return new SetlistSong({title:el.title, artist:el.artist, duration:el.duration, isPublished: el.is_published });
              }));
              this.__emitChange();
            }
        break;
      default:
        break;
    }
  }
}

export default new SetlistStore(AppDispatcher);
