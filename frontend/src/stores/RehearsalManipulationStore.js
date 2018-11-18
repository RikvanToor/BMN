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
    //Required override
    __onDispatch(payload){
        switch(payload.action){
            //Handle the load
            case RehearsalActions.GET_ALL_AVAILABILITIES:
              //Get the availabilities per rehearsal day, per user ID.
              this.availabilities = new Map().withMutations(map=>{
                Object.keys(payload.responseData).forEach((key)=>{
                  const data = payload.responseData[key];
                  let availabilities = data.availabilities.reduce((accum,value)=>{
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
              console.log(this.availabilities);
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