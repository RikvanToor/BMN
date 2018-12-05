import * as ApiActions from '@Actions/ApiActions.js';

export const SetlistActions = {
    ADD_SETLIST_SONG: 'ADD_SETLIST_SONG',
    ADD_SETLIST_SONG_FROM_SUGGESTIONS: 'ADD_SETLIST_SONG_FROM_SUGGESTIONS',
    REMOVE_SETLIST_SONG: 'REMOVE_SETLIST_SONG',
    GET_SETLIST: 'GET_SETLIST',
    REORDER_SETLIST: 'REORDER_SETLIST'
};

//API endpoints
const Endpoints = {
    addSetlistSong: 'setlist/add'
};

export function addSetlistSong(song){
    return ApiActions.createAuth({
        song : song
    }, Endpoints.addSetlistSong
    );
}