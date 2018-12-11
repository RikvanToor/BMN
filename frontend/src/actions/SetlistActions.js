import * as ApiActions from '@Actions/ApiActions.js';
import {format} from '@Utils/StringUtils.js';

export const SetlistActions = {
    ADD_SETLIST_SONG: 'ADD_SETLIST_SONG',
    ADD_SETLIST_SONG_FROM_SUGGESTIONS: 'ADD_SETLIST_SONG_FROM_SUGGESTIONS',
    REMOVE_SETLIST_SONG: 'REMOVE_SETLIST_SONG',
    GET_SETLIST: 'GET_SETLIST',
    REORDER_SETLIST: 'REORDER_SETLIST',
    MODIFY_SONG: 'MODIFY_SONG',
    UPDATE_CREW: 'UPDATE_CREW',
    PUBLISH_SETLIST_SONGS:'PUBLISH_SETLIST_SONGS'
};

//API endpoints
const Endpoints = {
    addSetlistSong: 'setlist/add',
    getSetlist: 'setlist/all',
    modifySong: 'setlist/{id}',
    updateCrew: 'setlist/{0}/players',
    removeSetlistSong: 'setlist/{0}',
    publishSongs: 'setlist/publish'
};

export function addSetlistSong(song){
    return ApiActions.createAuth(Object.assign({
        action: SetlistActions.ADD_SETLIST_SONG
    },song.forRequest()),
     Endpoints.addSetlistSong
    );
}
export function removeSetlistSong(song){
    return ApiActions.deleteAuth(
    {
        action: SetlistActions.REMOVE_SETLIST_SONG,
        id: song.id
    }
    ,format(Endpoints.removeSetlistSong, song.id));
}
export function publishSetlistSongs(ids){
    return ApiActions.updateAuth(
        {
            action: SetlistActions.PUBLISH_SETLIST_SONGS,
            ids: ids
        }, Endpoints.publishSongs);
}

export function updateCrew(id, newCrew){
    return ApiActions.updateAuth(
        {
            action: SetlistActions.UPDATE_CREW,
            players: newCrew,
            id: id
        },
        format(Endpoints.updateCrew, id)
    )
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