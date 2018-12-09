import * as ApiActions from '@Actions/ApiActions.js';
import {format} from '@Utils/StringUtils.js';

export const SetlistActions = {
    ADD_SETLIST_SONG: 'ADD_SETLIST_SONG',
    ADD_SETLIST_SONG_FROM_SUGGESTIONS: 'ADD_SETLIST_SONG_FROM_SUGGESTIONS',
    REMOVE_SETLIST_SONG: 'REMOVE_SETLIST_SONG',
    GET_SETLIST: 'GET_SETLIST',
    REORDER_SETLIST: 'REORDER_SETLIST',
    MODIFY_SONG: 'MODIFY_SONG'
};

//API endpoints
const Endpoints = {
    addSetlistSong: 'setlist/add',
    getSetlist: 'setlist/all',
    modifySong: 'setlist/{id}'
};

export function addSetlistSong(song){
    return ApiActions.createAuth({
        action: SetlistActions.ADD_SETLIST_SONG,
        song : song
    }, Endpoints.addSetlistSong
    );
}
export function getSetlistSongs(){
    return ApiActions.readAuth(
        {action: SetlistActions.GET_SETLIST},
        Endpoints.getSetlist
    );
}
export function modifySetlistSong(id, data){
    return ApiActions.updateAuth(
        {action : SetlistActions.MODIFY_SONG},
        format(Endpoints.modifySong, id)
    );
}