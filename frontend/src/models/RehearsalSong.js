import {Record} from 'immutable';
import {IntegerTimeInterval, IntegerTime} from '@Utils/DateTimeUtils.js';
import {isNumber} from '@Utils/TypeChecks.js';
export default class RehearsalSong extends Record({id:-1, title:'', rehearsalTime: IntegerTimeInterval.fromArmyTime(0,1)}){
    setRehearsalTime(start, end){
        let startT = isNumber(start) ? IntegerTime.fromArmyTime(start) : start;
        let endT = isNumber(end) ? IntegerTime.fromArmyTime(end) : end;
        return this.set('rehearsalTime', new IntegerTimeInterval(startT,endT));
    }
}