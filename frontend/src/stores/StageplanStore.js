/* eslint-disable no-underscore-dangle */
import { Store } from 'flux/utils';
import AppDispatcher, { deferredDispatch } from '@Services/AppDispatcher.js';
import { List, Record, Map } from 'immutable';

import { StageplanActions, addStageplanElementRemote } from '@Actions/StageplanActions.js';
import StagePosition from '@Models/Stageplan/StagePosition.js';
import Instrument from '@Models/Stageplan/Instrument.js';
import Geometry from '@Models/Stageplan/Geometry.js';
import Stageplan from '@Models/Stageplan/Stageplan.js';

import { withKeys } from '@Utils/ObjectUtils.js';

/**
 * Stores retrieved data with respect to rehearsals
 */
class StageplanStore extends Store {
  // Pass global dispatcher to parent class
  constructor(dispatcher) {
    super(dispatcher);

    this.stageplans = new List();
    this.activeStageplan = new Stageplan();
  }

  /**
     * Override of base class that is called when handling actions. Remember to not
     * dispatch new actions in this function.
     * @param {object} payload
     */
  __onDispatch(payload) {
    switch (payload.action) {
      case StageplanActions.ADD_STAGEPLAN_ELEMENT:
        // Handle action before sending to server
        this.activeStageplan = this.activeStageplan.addElement(payload.element);
        // Send the update to the server
        deferredDispatch(addStageplanElementRemote(payload.element, payload.id));
        this.__emitChange();
        break;
      case StageplanActions.DELETE_ELEMENT:
        this.activeStageplan = this.activeStageplan.deleteIn(['elements', payload.id]);
        this.__emitChange();
        break;
      case StageplanActions.ADD_STAGEPLAN_ELEMENT_REMOTE:
        // TODO fix this.
        this.activeStageplan = this.activeStageplan.withMutations((sp) => {
          const el = this.activeStageplan.getIn('elements', payload.element.id);
          el.id = payload.responseData.id;
          // Delete the entry under the old ID and add the entry under the new ID.
          sp.deleteIn(['elements', payload.element.id]).setIn(['elements', el.id], el.id);
        });
        this.__emitChange();
        break;
      case StageplanActions.GET_LATEST_STAGEPLAN:
        this.activeStageplan = new Stageplan(withKeys(payload.responseData, ['id', 'name', 'year']));
        this.activeStageplan = this.activeStageplan.withMutations((stpl) => {
          let els = new Map();
          els = els.withMutations((elsMap) => {
            payload.responseData.elements.forEach((el) => {
              // Convert plain javascript obj to Instrument model.
              const name = el.name ? el.name : '';
              elsMap.set(el.id, new Instrument(name, el.id, el.type, Geometry.fromStr(el.geometry)));
            });
          });
          stpl.set('elements', els);
          const order = payload.responseData.element_order.reduce((accum, el) => {
            if (els.has(el)) {
              accum.push(el);
            }
            return accum;
          }, []);
          stpl.set('ordering', order);
          // TODO channels
          // TODO roles
          // TODO positions
        });
        console.log(this.activeStageplan);
        // eslint-disable-next-line no-underscore-dangle
        this.__emitChange();
        break;
      default:
        break;
    }
  }
}

export default new StageplanStore(AppDispatcher);
