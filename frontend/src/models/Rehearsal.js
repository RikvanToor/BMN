import {Record, List} from 'immutable';
import IntegerTimeInterval from '@Utils/IntegerTimeInterval.js';

export default class Rehearsal extends Record({id:-1, location:'', songs:new Lists(), start:new Date(), end: new Date()}){
}