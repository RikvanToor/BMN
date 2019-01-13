import { Store } from 'flux/utils';

import { List } from 'immutable';

export default class StageplanManipulationStore extends Store {
  constructor(dispatcher) {
    super(dispatcher);

    this.undoStack = new List();
    this.redoStack = new List();
  }

  // eslint-disable-next-line class-methods-use-this
  __onDispatch(payload) {
    switch (payload.action) {
      default:
        break;
    }
  }
}
