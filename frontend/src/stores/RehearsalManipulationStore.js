import {Store} from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';
import {List, Map, Record, fromJS} from 'immutable';
import * as apiActions from '@Actions/ApiActions.js';
import {RehearsalActions} from '@Actions/RehearsalActions.js';
import {toHoursMinutesInt} from '@Utils/DateTimeUtils.js';

/**
 * Stores retrieved data with respect to user
 */
class RehearsalManipulationStore extends Store{
    //Pass global dispatcher to parent class
    constructor(dispatcher){
        super(dispatcher);
        //Songs associated with the rehearsal.
        this.rehearsalSongs = new Map();
        this.availabilities = new Map();
    }
    parseAvailabilityData(data){
      //Update availabilities of users per rehearsal
      this.availabilities = new Map().withMutations(map=>{
        Object.keys(data).forEach((key)=>{
          const rehearsalData = data[key];
          let availabilities = rehearsalData.availabilities.reduce((accum,value)=>{
            const uid = value.id;
            const valObj = {user: value.name, start:toHoursMinutesInt(value.pivot.start), end:toHoursMinutesInt(value.pivot.end)};
            if(uid in accum){
              accum[uid].push(valObj);
            }
            else{
              accum[uid] = [valObj];
            }
            return accum;
          },{});
          map.set(key, availabilities);
        });
      });
      //Update songs per rehearsal already specified.
      this.rehearsalSongs = new Map().withMutations(map=>{
        Object.keys(data).forEach((key)=>{
         const rehearsalData = data[key];
         let songs = rehearsalData.songs.map((value)=>{
            const uid = value.id;
            let valObj = {id: value.id, title:value.title, 
              start:toHoursMinutesInt(value.pivot.start), 
              end:toHoursMinutesInt(value.pivot.end)};
            valObj.players = value.players.map((player)=>{return{name:player.name, id:player.id}});
            return valObj;
          },);
          map.set(key, songs);
        });
      });
    }
    //Required override
    __onDispatch(payload){
        switch(payload.action){
            //Handle the load
            case RehearsalActions.GET_ALL_AVAILABILITIES:
              console.log(payload.responseData);
              //Get the availabilities per rehearsal day, per user ID.
              this.parseAvailabilityData(payload.responseData);
              console.log(this.availabilities);
              console.log(this.rehearsalSongs);
              this.__emitChange();
            break;
            case 'ERROR_MSG':
                console.log(payload);
                break;
        }
    }
}

//Export a singleton 
export default new RehearsalManipulationStore(AppDispatcher);