import {Store} from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';
import {RehearsalActions, updateRehearsalsAction, updateAvailabilitiesAction} from '@Actions/RehearsalActions.js';
import {List, Record} from 'immutable';

let inst = null;
let getRehearsals = 'rehearsals/schedules';
let getRehearsalsForPlayer = 'rehearsals/schedules/for/';
let getAvailabilities = 'rehearsals/availabilities';
let setAvailabilities = rehearsalId => 'rehearsals/' + rehearsalId + '/availabilities';


/**
 * Stores retrieved data with respect to rehearsals
 */
class RehearsalStore extends Store{
    //Pass global dispatcher to parent class
    constructor(dispatcher){
        super(dispatcher);

        this.rehearsals = new List();
        this.myAvailabilities = new List();

        //Possible errors
        this.error = undefined;
    }

    /**
     * Override of base class that is called when handling actions. Remember to not 
     * dispatch new actions in this function.
     * @param {object} payload
     */
    __onDispatch(payload){
        switch(payload.action){
            case RehearsalActions.GET_REHEARSALS:
                AppDispatcher.dispatchPromisedFn(
                    ApiService.readAuthenticatedData(getRehearsals, {}),
                    data=>{
                        return updateRehearsalsAction(data);
                    },
                    errData=>{
                        this.error = errData;
                    }
                );
                break;
            case RehearsalActions.GET_REHEARSALS_FOR_PLAYER:
                AppDispatcher.dispatchPromisedFn(
                    ApiService.readAuthenticatedData(getRehearsalsForPlayer + payload.playerid, {}),
                    data=>{
                        return updateRehearsalsAction(data);
                    },
                    errData=>{
                        this.error = errData;
                    }
                );
                break;
            case RehearsalActions.UPDATE_REHEARSALS:
                this.rehearsals = new List(payload.rehearsals);
                this.__emitChange();
                break;
            case RehearsalActions.GET_AVAILABILITIES:
                AppDispatcher.dispatchPromisedFn(
                    ApiService.readAuthenticatedData(getAvailabilities, {}),
                    data=>{
                        return updateAvailabilitiesAction(data);
                    },
                    errData=>{
                        this.error = errData;
                    }
                );
                break;
            case RehearsalActions.UPDATE_AVAILABILITIES:
                this.myAvailabilities = new List(payload.availabilities);
                this.__emitChange();
                break;
            case RehearsalActions.SET_AVAILABILITIES:
                AppDispatcher.dispatchPromisedFn(
                    ApiService.updateData(setAvailabilities(payload.rehearsalId), payload.availabilities),
                    data=>{
                        payload.callback();
                    },
                    errData=>{
                        this.error = errData;
                    }
                );
                break;
        }
    }
}

export default new RehearsalStore(AppDispatcher);