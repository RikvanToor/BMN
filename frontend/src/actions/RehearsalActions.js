import * as typeChecks from '@Utils/TypeChecks.js';
import {List} from 'immutable';
import {createAuth, deleteAuth, postAuth} from '@Actions/ApiActions.js';
import {dateWithIntTime} from '@Utils/DateTimeUtils.js';

export const RehearsalActions = {
  GET_REHEARSALS: 'GET_REHEARSALS',
  GET_REHEARSALS_FOR_PLAYER: 'GET_REHEARSALS_FOR_PLAYER',
  UPDATE_REHEARSALS: 'UPDATE_REHEARSALS',
  GET_REHEARSAL: 'GET_REHEARSAL',
  CREATE_REHEARSAL: 'CREATE_REHEARSAL',
  CREATE_REHEARSALS: 'CREATE_REHEARSALS',
  ADD_SONG: 'ADD_SONG',
  REMOVE_SONG: 'REMOVE_SONG',
  DELETE_REHEARSALS: 'DELETE_REHEARSALS',
  GET_AVAILABILITIES: 'GET_AVAILABILITIES',
  SET_AVAILABILITIES: 'SET_AVAILABILITIES',
  UPDATE_AVAILABILITIES: 'UPDATE_AVAILABILITIES',
};

const Endpoints = {
  createMultiple: 'rehearsals/createMultiple',
  deleteSingle: (id)=>`rehearsals/${id}`,
  deleteMultiple: 'rehearsals/delete'
};

export function getScheduleAction() {
  return { action: RehearsalActions.GET_REHEARSALS };
}

export function getScheduleForPlayerAction(playerid) {
  return { action: RehearsalActions.GET_REHEARSALS_FOR_PLAYER, playerid };
}

export function updateRehearsalsAction(rehearsals) {
  return { action: RehearsalActions.UPDATE_REHEARSALS, rehearsals };
}

export function getRehearsalAction(id) {
  return { action: RehearsalActions.GET_REHEARSAL, id };
}

export function CREATE_REHEARSAL(rehearsal) {
  return { action: RehearsalActions.CREATE_REHEARSAL, rehearsal };
}

/**
 * Creates the createRehearsals action, which remotely creates the new rehearsals.
 * @param {List|array} rehearsals Immutable List of rehearsals or array of JS rehearsal objects. 
 *  Should contain date {Date}, location {string}, startTime {int} and endTime {int} fields.
 * @returns {object} The action object
 */
export function createRehearsals(rehearsals){
  let rehearsalsToSend = rehearsals;
  if(!typeChecks.isArray(rehearsals)){
    if(rehearsals instanceof List){
      rehearsalsToSend = rehearsals.toJS();
    }
    else{
      throw new Error("Unknown data type for rehearsals");
    }
  }
  //Convert to data to use.
  rehearsalsToSend = rehearsalsToSend.map((el)=>{
    console.log(el.date);
    return {
      location: el.location, 
      start:dateWithIntTime(el.date,el.startTime),
      end:dateWithIntTime(el.date,el.endTime)
    };
  });
  //Authorized create request.
  return createAuth(
    { 
      action: RehearsalActions.CREATE_REHEARSALS, 
      rehearsals: rehearsalsToSend
    }, Endpoints.createMultiple);
}

/**
 * Create the action that deletes the rehearsal with the given ID
 * @param {int} rehearsalId The rehearsal ID
 * @returns {object} The action object
 */
export function deleteRehearsal(rehearsalId){
  if(!typeChecks.isNumber(rehearsalId)) throw new Error("Expected an integer for the rehearsal ID for deletion");
  
  return deleteAuth(
    {
      action: RehearsalActions.DELETE_REHEARSALS
    }, Endpoints.deleteSingle(rehearsalId));
}

/**
 * Creates the action to delete multiple rehearsals
 * @param {array} rehearsalIds The IDs of the rehearsals to delete.
 * @returns {object} The action object
 */
export function deleteRehearsals(rehearsalIds){
  if(rehearsalIds.length === 1) return deleteRehearsal(rehearsalIds[0]);
  //We send a POST request here, since we need to send multiple ids as an array, which is not possible via
  //the regular DELETE method, which does not allow a message body in general.
  return postAuth(
    {
      action: RehearsalActions.DELETE_REHEARSALS, 
      ids:rehearsalIds
    }, Endpoints.deleteMultiple);
}


export function ADD_SONG(rehearsalid, songid, start, end) {
  return {
    action: RehearsalActions.ADD_SONG,
    rehearsalId: rehearsalid,
    songId: songid,
    start,
    end,
  };
}

export function REMOVE_SONG(rehearsalid, songid) {
  return { action: RehearsalActions.REMOVE_SONG, rehearsalId: rehearsalid, songid };
}

export function getAvailabilitiesAction() {
  return { action: RehearsalActions.GET_AVAILABILITIES };
}

export function setAvailabilitiesAction(rehearsalid, availabilities, callback) {
  return {
    action: RehearsalActions.SET_AVAILABILITIES, rehearsalId: rehearsalid, availabilities, callback,
  };
}

export function updateAvailabilitiesAction(availabilities) {
  return { action: RehearsalActions.UPDATE_AVAILABILITIES, availabilities };
}
