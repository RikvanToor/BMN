import { Store } from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';
import { NewsActions, updateNewsAction } from '@Actions/NewsActions.js';

const getNews = 'news';

/**
 * Stores and updates all news articles
 */
class NewsStore extends Store {
  constructor(dispatcher) {
    super(dispatcher);

    this.news = [];

    // possible errors
    this.error = undefined;
  }

  /**
   * Override of base class that is called when handling actions. Remember to not
   * dispatch new actions in this function.
   * @param {object} payload
   */
  __onDispatch(payload) {
    switch(payload.action) {
      case NewsActions.GET_NEWS:
        AppDispatcher.dispatchPromisedFn(
          ApiService.readAuthenticatedData(getNews, {}),
          data => updateNewsAction(data),
          (errData) => {
            this.error = errData;
          },
        );
        break;
      case NewsActions.UPDATE_NEWS:
        this.news = payload.news;
        this.__emitChange();
        break;
    }
  }
}

export default new NewsStore(AppDispatcher);