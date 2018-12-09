import {Record, List} from 'immutable';

export default class SetlistSong extends Record({title:'',artist:'',duration:0, isPublished : false, players:new List() }){
    static fromResponse(responseData){
        
    }
}