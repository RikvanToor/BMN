import { Store } from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';
import { NewsActions, updateNewsAction, updateArticleAction } from '@Actions/NewsActions.js';
import { List } from 'immutable';

const getNews = 'news';
const urls = {
  getNews: 'news',
  updateNews: 'news/update'
}

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
    switch (payload.action) {
      case NewsActions.GET_NEWS:
        AppDispatcher.dispatchPromisedFn(
          ApiService.readAuthenticatedData(urls.getNews, {}),
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
      case NewsActions.EDIT_NEWS:
        AppDispatcher.dispatchPromisedFn(
          ApiService.updateData(urls.updateNews, {
            id: payload.id,
            title: payload.news.title,
            content: payload.news.content
          }),
          data => updateArticleAction(data, payload.callback),
          (errData) => {
            this.error = errData;
          },
        );
        break;
      case NewsActions.UPDATE_ARTICLE:
        var index = this.news.findIndex(x => x.id === payload.article.id);
        if (index > -1) {
          this.news[index] = payload.article;
          this.news = new List(this.news);
          payload.callback();
          this.__emitChange();
        }
        break;
    }
  }
}

export default new NewsStore(AppDispatcher);