import { Store } from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';
import { NewsActions, updateNewsAction, 
  updateArticleAction, updateArticleDeletedAction, 
  addArticleAction, updateErrorAction } from '@Actions/NewsActions.js';

const urls = {
  createNews: 'news',
  readNews: 'news',
  updateNews: 'news/update',
  deleteNews: 'news'
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
          ApiService.readAuthenticatedData(urls.readNews, {}),
          data => updateNewsAction(data),
          (errData) => updateErrorAction(errData),
        );
        break;
      case NewsActions.UPDATE_NEWS:
        this.error = undefined;
        this.news = payload.news;
        this.__emitChange();
        break;
      case NewsActions.CREATE_NEWS:
        AppDispatcher.dispatchPromisedFn(
          ApiService.createData(urls.createNews, {
            title: payload.news.title,
            content: payload.news.content
          }),
          data => addArticleAction(data),
          (errData) => updateErrorAction(errData),
        );
        break;
      case NewsActions.EDIT_NEWS:
        AppDispatcher.dispatchPromisedFn(
          ApiService.updateData(urls.updateNews, {
            id: payload.id,
            title: payload.news.title,
            content: payload.news.content
          }),
          data => updateArticleAction(data),
          (errData) => updateErrorAction(errData),
        );
        break;
      case NewsActions.DELETE_NEWS:
        AppDispatcher.dispatchPromisedFn(
          ApiService.deleteData(urls.deleteNews + '/' + payload.id, {}),
          () => updateArticleDeletedAction(payload.id),
          (errData) => updateErrorAction(errData),
        );
        break;
      case NewsActions.UPDATE_ARTICLE:
        this.error = undefined;
        var index = this.news.findIndex(x => x.id === payload.article.id);
        if (index > -1) {
          this.news[index] = payload.article;
          this.news = this.news.splice(0);
          this.__emitChange();
        }
        break;
      case NewsActions.UPDATE_ARTICLE_DELETED:
        this.error = undefined;
        var index = this.news.findIndex(x => x.id === payload.id);
        if (index > -1) {
          this.news.splice(index, 1);
          this.news = this.news.splice(0);
          this.__emitChange();
        }
        break;
      case NewsActions.ADD_ARTICLE:
        this.error = undefined;
        this.news.unshift(payload.news);
        this.news = this.news.splice(0);
        this.__emitChange();
        break;
      case NewsActions.UPDATE_ERROR:
        this.error = payload.error;
        this.__emitChange();
        break;
    }
  }
}

export default new NewsStore(AppDispatcher);