import { Store } from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';
import { List, Record } from 'immutable';

import {SetlistActions } from '@Actions/SetlistActions.js';

class SetlistSong extends Record({title:'',artist:'',durationS:0, comment:'',spotify:'',youtube:''}){}

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
        case SetlistActions.ADD_SETLIST_SONG:
            
        break;
      default:
        break;
    }
  }
}

export default new SetlistStore(AppDispatcher);
