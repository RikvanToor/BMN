import { Store } from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';
import { SuggestionsActions, getSuggestions } from '@Actions/SuggestionsActions.js';
import { List } from 'immutable';

/**
 * Stores retrieved data with respect to user
 */
class SuggestionsStore extends Store {
  // Pass global dispatcher to parent class
  constructor(dispatcher) {
    super(dispatcher);


    // All suggestions
    this.suggestions = new List();
  }

  // Required override
  __onDispatch(payload) {
    switch (payload.action) {
      // Handle the load
      case SuggestionsActions.GET_SUGGESTIONS:
        console.log(payload.responseData);
        this.suggestions = new List(payload.responseData);
        this.__emitChange();
        break;
    }
  }
}

// Export a singleton
export default new SuggestionsStore(AppDispatcher);
