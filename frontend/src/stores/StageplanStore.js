import { Store } from 'flux/utils';
import AppDispatcher from '@Services/AppDispatcher.js';
import { List, Record } from 'immutable';

import { StageplanActions } from '@Actions/StageplanActions.js';
import StagePosition from '@Models/StagePlane/StagePositions.js';

/**
 * Stores retrieved data with respect to rehearsals
 */
class StageplanStore extends Store {
  // Pass global dispatcher to parent class
  constructor(dispatcher) {
    super(dispatcher);

    // All setlist songs
    this.stagePositions = new List();
    this.instruments = new List();
  }

  /**
     * Override of base class that is called when handling actions. Remember to not
     * dispatch new actions in this function.
     * @param {object} payload
     */
  __onDispatch(payload) {
    switch (payload.action) {
      case StageplanActions.GET_STAGEPLAN_ELEMENTS_AND_INSTRUMENTS:
        this.stagePositions = new List(payload.responseData.map(el => new StagePosition(el)));
        break;
      default:
        break;
    }
  }
}

export default new StageplanStore(AppDispatcher);
