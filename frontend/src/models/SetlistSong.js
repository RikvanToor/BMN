import {Record, List} from 'immutable';
import {withChangedKeys} from '@Utils/ObjectUtils.js';

export default class SetlistSong extends Record({id:-1,title:'',artist:'',duration:0, isPublished: false, comment:'', spotifyLink:'', players:new List() }){
    static fromResponse(responseData){
        
    }
    forRequest(){
        //Omit players
        return withChangedKeys(this.toJS(),[['isPublished','is_published'],['spotifyLink','spotify_link'],['players','']]);
    }
}
/**
 * Player model
 */
export class Player extends Record({id:-1, name:'',instrument:''}){}