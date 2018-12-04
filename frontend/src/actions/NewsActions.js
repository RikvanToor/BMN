export const NewsActions = {
  GET_NEWS: 'GET_NEWS',
  CREATE_NEWS: 'CREATE_NEWS',
  EDIT_NEWS: 'EDIT_NEWS',
  DELETE_NEWS: 'DELETE_NEWS',
  UPDATE_NEWS: 'UPDATE_NEWS',
  UPDATE_ARTICLE: 'UPDATE_ARTICLE',
  UPDATE_ARTICLE_DELETED: 'UPDATE_ARTICLE_DELETED',
  ADD_ARTICLE: 'ADD_ARTICLE'
}

export function getNewsAction() {
  return { action: NewsActions.GET_NEWS };
}

export function createNewsAction(news) {
  return { action: NewsActions.CREATE_NEWS, news: news };
}

export function editNewsAction(id, news, callback) {
  return { action: NewsActions.EDIT_NEWS, id: id, news: news };
}

export function deleteNewsAction(id) {
  return { action: NewsActions.DELETE_NEWS, id: id };
}

export function updateNewsAction(news) {
  return { action: NewsActions.UPDATE_NEWS, news, };
}

export function updateArticleAction(article) {
  return { action: NewsActions.UPDATE_ARTICLE, article };
}

export function updateArticleDeletedAction(id) {
  return { action: NewsActions.UPDATE_ARTICLE_DELETED, id };
}

export function addArticleAction(news) {
  return { action: NewsActions.ADD_ARTICLE, news };
}