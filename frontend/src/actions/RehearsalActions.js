import AppDispatcher from '@Services/AppDispatcher.js';

export const RehearsalActions = {
    GET_REHEARSALS : 'GET_REHEARSALS',
    UPDATE_REHEARSALS : 'UPDATE_REHEARSALS',
    GET_REHEARSAL : 'GET_REHEARSAL',
    CREATE_REHEARSAL : 'CREATE_REHEARSAL',
    ADD_SONG : 'ADD_SONG',
    REMOVE_SONG : 'REMOVE_SONG'
};

export function getRehearsalsAction(){
    return {action: RehearsalActions.GET_REHEARSALS};
}

export function updateRehearsalsAction(rehearsals){
    return {action: RehearsalActions.UPDATE_REHEARSALS, rehearsals: rehearsals}
}

export function getRehearsalAction(id){
    return {action: RehearsalActions.GET_REHEARSAL, id: id}
}

export function CREATE_REHEARSAL(rehearsal){
    return {action: RehearsalActions.CREATE_REHEARSAL, rehearsal: rehearsal}
}

export function ADD_SONG(rehearsalid, songid, start, end){
    return {action: RehearsalActions.ADD_SONG, rehearsalId: rehearsalid,
            songId: songid, start: start, end: end}
}

export function REMOVE_SONG(rehearsalid, songid){
    return {action: RehearsalActions.REMOVE_SONG, rehearsalId: rehearsalid, songid: songid}
}