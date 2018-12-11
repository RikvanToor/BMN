import {Record, List} from 'immutable';

export default class SetlistSong extends Record({id:-1,title:'',artist:'',duration:0, isPublished : false, players:new List() }){
    static fromResponse(responseData){
        
    }
}
/**
 * Player model
 */
export class Player extends Record({id:-1, name:'',instrument:''}){}