import { Store } from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';
import { RehearsalActions, updateRehearsalsAction, updateAvailabilitiesAction } from '@Actions/RehearsalActions.js';
import { List } from 'immutable';
import {withKeys} from '@Utils/ObjectUtils.js';

const getRehearsals = 'rehearsals/schedules';
const getRehearsalsForPlayer = 'rehearsals/schedules/for/';
const getAvailabilities = 'rehearsals/availabilities';
const getAllAvailabilities = 'rehearsals/availabilities/all';
const setAvailabilities = rehearsalId => `rehearsals/${rehearsalId}/availabilities`;


/**
 * Stores retrieved data with respect to rehearsals
 */
class RehearsalStore extends Store {
  // Pass global dispatcher to parent class
  constructor(dispatcher) {
    super(dispatcher);

    //All rehearsals
    this.rehearsals = new List();
    //Personal availabilities of current user
    this.myAvailabilities = new List();

    this.allAvailabilities = new List();

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
      case RehearsalActions.GET_REHEARSALS:
        AppDispatcher.dispatchPromisedFn(
          ApiService.readAuthenticatedData(getRehearsals, {}),
          data => updateRehearsalsAction(data),
          (errData) => {
            this.error = errData;
          },
        );
        break;
      case RehearsalActions.GET_REHEARSALS_FOR_PLAYER:
        AppDispatcher.dispatchPromisedFn(
          ApiService.readAuthenticatedData(getRehearsalsForPlayer + payload.playerid, {}),
          data => updateRehearsalsAction(data),
          (errData) => {
            this.error = errData;
          },
        );
        break;
      //Set all rehearsals to the given rehearsals
      case RehearsalActions.UPDATE_REHEARSALS:
        this.rehearsals = new List(payload.rehearsals);
        this.__emitChange();
        break;
        
      //Handle setting new song times on the rehearsal
      case RehearsalActions.SET_REHEARSAL_SONGS:
        let rehearsalId = payload.responseData.id;
        let ind = this.rehearsals.findIndex((el)=>el.id == rehearsalId);
        this.rehearsals = this.rehearsals.set(ind, payload.responseData);
        this.__emitChange();
        break;

      //Retrieve availability 
      case RehearsalActions.GET_AVAILABILITIES:
        AppDispatcher.dispatchPromisedFn(
          ApiService.readAuthenticatedData(getAvailabilities, {}),
          data => updateAvailabilitiesAction(data),
          (errData) => {
            this.error = errData;
          },
        );
        break;

        //Retrieve availability 
      case RehearsalActions.GET_ALL_AVAILABILITIES:
        this.allAvailabilities = payload.responseData.map((rehearsal)=>{
          let newRehearsal = withKeys(rehearsal, ['id','location','start','end', 'reason']);
          newRehearsal.start = new Date(newRehearsal.start);
          newRehearsal.end = new Date(newRehearsal.end);
          //Create the availabilities in a compact manner.
          newRehearsal.availabilities = rehearsal.availabilities.map((el)=>{
            let av = withKeys(el, ['name','id']);
            av.start = new Date(el.pivot.start);
            av.end = new Date(el.pivot.end);
            av.reason = el.pivot.reason;
            return av;
          });
          return newRehearsal;
        });
        this.__emitChange();
      break;
        
      //Add newly created rehearsals after being added on the server
      case RehearsalActions.CREATE_REHEARSALS:
        //Create list for new rehearsals
        let newRehearsals = new List(payload.responseData);
        //Concatenate to present rehearsals.
        this.rehearsals = this.rehearsals.concat(newRehearsals);
        this.__emitChange();
      break;
      
      //Delete rehearsals
      case RehearsalActions.DELETE_REHEARSALS:
        let data = payload.responseData;
        //Delete a single rehearsal
        if('id' in data){
          let id = parseInt(data.id);
          let ind = this.rehearsals.findIndex((val, ind)=>{
            return val.id === id;
          });
          //ID was found
          if(ind !== -1){
            this.rehearsals = this.rehearsals.delete(ind);
            this.__emitChange();
          }
        }
        //Delete multiple rehearsals
        else if('ids' in data){
          let ids = new Set(data.ids.map((el)=>parseInt(el)));
          this.rehearsals = this.rehearsals.filter(val=>{
            return !ids.has(val.id);
          });
          this.__emitChange();
        }
      break;
      
      //Update availabilities for the current user
      case RehearsalActions.UPDATE_AVAILABILITIES:
        this.myAvailabilities = new List(payload.availabilities);
        this.__emitChange();
        break;
      
      //Sets new availabilities.
      case RehearsalActions.SET_AVAILABILITIES:
        AppDispatcher.dispatchPromisedFn(
          ApiService.updateData(setAvailabilities(payload.rehearsalId), payload.availabilities),
          () => {
            payload.callback();
          },
          (errData) => {
            this.error = errData;
          },
        );
        break;
      default:
        break;
    }
  }
}

export default new RehearsalStore(AppDispatcher);
