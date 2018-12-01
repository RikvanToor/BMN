export const NewsActions = {
  GET_NEWS: 'GET_NEWS',
  CREATE_NEWS: 'CREATE_NEWS',
  EDIT_NEWS: 'EDIT_NEWS',
  DELETE_NEWS: 'DELETE_NEWS',
  UPDATE_NEWS: 'UPDATE_NEWS'
}

export function getNewsAction() {
  return { action: NewsActions.GET_NEWS };
}

export function createNewsAction(news) {
  return { action: NewsActions.CREATE_NEWS, news: news };
}

export function editNewsAction(id, news) {
  return { action: NewsActions.EDIT_NEWS, id: id, news: news };
}

export function deleteNewsAction(id) {
  return { action: NewsActions.DELETE_NEWS, id: id };
}

export function updateNewsAction(news) {
  return { action: NewsActions.UPDATE_NEWS, news };
}