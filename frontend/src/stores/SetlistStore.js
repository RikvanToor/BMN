import { Store } from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';
import { List, Record } from 'immutable';

import {SetlistActions } from '@Actions/SetlistActions.js';
import SetlistSong from '@Models/SetlistSong.js';
import {withKeys} from '@Utils/ObjectUtils.js';

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
              //Process the response data
              this.setlist = new List(payload.responseData.map(el=>{

                let song = new SetlistSong(withKeys(el,['id','title','artist','duration',['isPublished','is_published']]));
                
                //Set players
                return song.set('players', el.players.map((player)=>{
                  //Basic player info
                  let basePlayer = withKeys(player,['name','id']);
                  //Get instrument from pivot
                  basePlayer.instrument = player.pivot.instrument;
                  return basePlayer;
                }))
              }));
              this.__emitChange();
            }
        break;
        case SetlistActions.REMOVE_SETLIST_SONG:
            this.setlist = this.setlist.filter((val)=>val.id != payload.id);
            this.__emitChange();
      default:
        break;
    }
  }
}

export default new SetlistStore(AppDispatcher);
