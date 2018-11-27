import { Dispatcher } from 'flux';

import ApiService from '@Services/ApiService.js';
import {expectHasKeys} from '@Utils/TypeChecks.js';

import AppDispatcher from '@Services/AppDispatcherClass.js';

//Add middleware
import dispatchRemote from '@Services/dispatcherMiddleware/dispatchRemote.js';

// Global singleton
let appDispatcher = new AppDispatcher();
appDispatcher.addMiddleWare(dispatchRemote);

export function deferredDispatch(action) {
  setTimeout(() => {
    appDispatcher.dispatch(action);
  });
}
/**
 * Convenience function that dispatches the action via the global AppDispatcher.
 * @param {object} action Action object, preferably created via an action creator.
 */
export function dispatch(action) {
  appDispatcher.dispatch(action);
}

export default appDispatcher;
