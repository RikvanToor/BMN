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

    //All setlist songs
    this.setlist = new List();

    this.setlistSong = new SetlistSong;
  }

  /**
   * Acquire players from a Song object response from the API
   * @param {object} song The song object, returned by the API 
   */
  static playersForSong(song){
    return song.players.map((player)=>{
      //Basic player info
      let basePlayer = withKeys(player,['name','id']);
      //Get instrument from pivot
      basePlayer.instrument = player.pivot.instrument;
      return basePlayer;
    });
  }
  static songFromResponse(songObj){
    let song = new SetlistSong(withKeys(songObj,['id','title','artist','duration',['isPublished','is_published']]));
                
    //Set players if available
    if('players' in songObj)
      return song.set('players',SetlistStore.playersForSong(songObj));
    
    return song;
  }

  /**
     * Override of base class that is called when handling actions. Remember to not
     * dispatch new actions in this function.
     * @param {object} payload
     */
  __onDispatch(payload) {
    switch (payload.action) {
        case SetlistActions.GET_SETLIST:
              //Process the response data
              this.setlist = new List(payload.responseData.map(el=>SetlistStore.songFromResponse(el)));
              this.__emitChange();
        break;
        case SetlistActions.ADD_SETLIST_SONG:
          this.setlist = this.setlist.push(SetlistStore.songFromResponse(payload.responseData));
          this.__emitChange();
        break;
        case SetlistActions.UPDATE_CREW:
            //Find the index of the song
            let index = this.setlist.findKey((val)=>val.id == payload.id);
            if(index < 0) return;
            this.setlist = this.setlist.setIn([index,'players'], SetlistStore.playersForSong({players: payload.responseData}) );
            this.__emitChange();
          break;
        case SetlistActions.REMOVE_SETLIST_SONG:
            this.setlist = this.setlist.filter((val)=>val.id != payload.id);
            this.__emitChange();
            break;
      default:
        break;
    }
  }
}

export default new SetlistStore(AppDispatcher);
