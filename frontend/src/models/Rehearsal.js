import {Record, List} from 'immutable';

export default class Rehearsal extends Record({id:-1, location:'', songs:new Lists(), start:new Date(), end: new Date(), reason: ''}){
    isAbsent(){
        return reason.length > 0;
    }
}