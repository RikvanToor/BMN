import AppDispatcher from '@Services/AppDispatcher.js';

export const RehearsalActions = {
  GET_REHEARSALS: 'GET_REHEARSALS',
  GET_REHEARSALS_FOR_PLAYER: 'GET_REHEARSALS_FOR_PLAYER',
  UPDATE_REHEARSALS: 'UPDATE_REHEARSALS',
  GET_REHEARSAL: 'GET_REHEARSAL',
  CREATE_REHEARSAL: 'CREATE_REHEARSAL',
  ADD_SONG: 'ADD_SONG',
  REMOVE_SONG: 'REMOVE_SONG',
  GET_AVAILABILITIES: 'GET_AVAILABILITIES',
  SET_AVAILABILITIES: 'SET_AVAILABILITIES',
  UPDATE_AVAILABILITIES: 'UPDATE_AVAILABILITIES',
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
