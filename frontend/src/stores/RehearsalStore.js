import {Store} from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';
import {RehearsalActions, updateRehearsalsAction} from '@Actions/RehearsalActions.js';
import {List, Record} from 'immutable';

let inst = null;
let getRehearsals = 'rehearsals/schedules';
let getRehearsalsForPlayer = 'rehearsals/schedules/for/';


/**
 * Stores retrieved data with respect to rehearsals
 */
class RehearsalStore extends Store{
    //Pass global dispatcher to parent class
    constructor(dispatcher){
        super(dispatcher);

        this.rehearsals = new List();

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
                )
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
                )
                break;
            case RehearsalActions.UPDATE_REHEARSALS:
                this.rehearsals = new List(payload.rehearsals);
                this.__emitChange();
                break;
        }
    }
}

export default new RehearsalStore(AppDispatcher);