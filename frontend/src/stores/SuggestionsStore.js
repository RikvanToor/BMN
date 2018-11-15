import { Store } from 'flux-utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';


const SuggestionsAction = {
  LOAD_DATA: 'LOAD_DATA',
  SAVE_CHANGES: 'SAVE_CHANGES',
};

// Static instance variable
const inst = null;

/**
 * Stores retrieved data with respect to user
 */
class SuggestionsStore extends Store {
  // Pass global dispatcher to parent class
  constructor(dispatcher) {
    super(dispatcher);
    this.singers = [];

    // Save modifications on singer ability to sing song
    this.modifications = [];

    this.suggestions = [];
  }

  // Required override
  __onDispatch(payload) {
    switch (payload.action) {
      // Handle the load
      case SuggestionsAction.LOAD_DATA:
        params = {};
        if (typeof payload.limit !== 'undefined' && Number.isInteger(payload.limit) && payload.limit > 0) {
          params.limit = payload.limit;
        }
        // Requires auth
        ApiService.readData('suggesties', params, true)
          .then((data) => {
            try {
              this.suggestions = JSON.parse(data);


              // Notify listeners
              __emitChange();
            } catch (e) {
              this.getDispatcher().dispatch({ action: 'ERROR_MSG', msg: 'Failed to decode data from server for suggestions.' });
            }
          })
          .catch((errData) => {
            // Some smart handling here
            this.getDispatcher().dispatch({ action: 'ERROR_MSG', msg: `Got an error while requesting data:${errData.msg}` });
          });
        break;
      case SuggestionsAction.SAVE_CHANGES:
        ApiService.updateData('suggesties', { modifications: this.modifications }, true)
          .then((result) => {

          })
          .catch((err) => {

          });
        break;
    }
  }
}

// Export a singleton
export default new SuggestionsStore(AppDispatcher);
