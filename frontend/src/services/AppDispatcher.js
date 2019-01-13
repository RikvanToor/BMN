import { Dispatcher } from 'flux';

import ApiService from '@Services/ApiService.js';
import {expectHasKeys} from '@Utils/TypeChecks.js';

import AppDispatcher from '@Services/AppDispatcherClass.js';

//Add middleware
import dispatchRemote from '@Services/dispatcherMiddleware/dispatchRemote.js';
import logAction from '@Services/dispatcherMiddleware/logAction.js';
import captureBeforeRemote from '@Services/dispatcherMiddleware/captureBeforeRemote.js';

// Global singleton
let appDispatcher = new AppDispatcher();
//Order matters
appDispatcher.addMiddleWare(captureBeforeRemote);
appDispatcher.addMiddleWare(logAction);
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
