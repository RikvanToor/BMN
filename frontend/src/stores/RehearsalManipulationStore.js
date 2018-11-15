import {Store} from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';
import {List, Map, Record, fromJS} from 'immutable';
import * as apiActions from '@Actions/ApiActions.js';

const RehearsalManipulationActions = {
    LOAD_ALL_REHEARSALS : 'LOAD_ALL_REHEARSALS',
    ADD_SONG_TO_REHEARSAL : 'ADD_SONG_TO_REHEARSAL',
    PUBLISH_REHEARSAL: 'PUBLISH_REHEARSAL'
};

//
const Endpoints = {
    REHEARSALS_ENDPOINT : 'rehearsals'
};

export function loadAllRehearsals(){
    return apiActions.readAuth({
        action : RehearsalManipulationActions.LOAD_ALL_REHEARSALS
    }, Endpoints.REHEARSALS_ENDPOINT);
}


/**
 * Stores retrieved data with respect to user
 */
class RehearsalManipulationStore extends Store{
    //Pass global dispatcher to parent class
    constructor(dispatcher){
        super(dispatcher);
        this.rehearsals = new List();
        this.rehearsalSongs = new Map();
    }
    //Required override
    __onDispatch(payload){
        console.log("Dispatched action on rehearsal manip: " + payload.action);
        switch(payload.action){
            //Handle the load
            case RehearsalManipulationActions.LOAD_ALL_REHEARSALS:
                //Requires auth
                console.log("Loading rehearsals");
                console.log(payload.responseData);
                this.rehearsals = new List(payload.responseData);
                //Notify listeners
                this.__emitChange();
                break;
            case 'ERROR_MSG':
                console.log(payload);
                break;
            case RehearsalManipulationActions.SAVE_CHANGES:
                ApiService.updateData('suggesties', {modifications: this.modifications}, true)
                .then(result=>{
                    
                })
                .catch(err=>{
                    
                });
                break;
                
        }
    }
}

//Export a singleton 
export default new RehearsalManipulationStore(AppDispatcher);