import { defer } from '@Utils/FunctionUtils.js';

/**
 * Dispatch an action, desginated as remote (via the 'remote' key), 
 * before actually dispatching to the remote server. This allows you
 * to handle the action beforehand for e.g. providing immediate feedback
 * to the user
 * @param {Function} dispatchFn The dispatch function for dispatching actions
 * @param {object} action An action
 */
export default function captureBeforeRemote(dispatchFn, action) {
  if ('captureBefore' in action && 'remote' in action) {
    const newAction = action;
    // Set appropriate phase, delete remote temporarily
    newAction.phase = 'before';
    delete newAction.remote;
    dispatchFn(action);
    defer(() => {
      newAction.phase = 'afterRemote';
      newAction.remote = true;
      dispatchFn(newAction);
    });
    // Action was handled
    return true;
  }
  // Leave handling to others
  return false;
}
