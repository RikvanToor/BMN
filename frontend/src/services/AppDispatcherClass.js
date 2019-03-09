import { Dispatcher } from 'flux';

import ApiService from '@Services/ApiService.js';
import { expectHasKeys } from '@Utils/TypeChecks.js';

export default class AppDispatcher extends Dispatcher {
  constructor() {
    super();
    this.middleware = [];
  }

  addMiddleWare(middelwareFn) {
    this.middleware.push(middelwareFn);
  }

  dispatch(action) {
    // Try to handle the action in middleware
    const dispatchFn = this.dispatch.bind(this);
    for (let i = 0; i < this.middleware.length; i++) {
      // Middleware handled dispatch: we are done
      if (this.middleware[i](dispatchFn, action)) {
        return;
      }
    }
    // Middleware did not handle action: dispatch the action regularly
    super.dispatch(action);
  }

  /**
     * Respond to a promise with an action. All resolved data of the promise will be added to the payload.
     * Note that we can call this is the __onDispatch functions of stores, since Promises resolve
     * at the earliest in the next tick.
     * @param {Promise} promise The promise that was created
     * @param {string} succesActionName Name of the action to perform on success (resolve)
     * @param {string} failActionName Name of the action to perform on failure (reject)
     */
  dispatchPromised(promise, succesActionName, failActionName) {
    setTimeout(() => {
      promise.then((data) => {
        this.dispatch({ action: succesActionName, ...data });
      })
        .catch((errData) => {
          this.dispatch({ action: failActionName, ...errData });
        });
    });
  }

  /**
     * Sames as dispatchPromised, only applies the functions to the returned data to create
     * payloads for the dispatcher. Make sure to set the action key on the payload!
     * @param {Promise} promise The promise that was created
     * @param {function} succesFn Function that creates success payload to be processed
     * @param {function} failFn Function that creates fail payload to be processed
     */
  dispatchPromisedFn(promise, succesFn, failFn) {
    setTimeout(() => {
      promise.then((data) => {
        this.dispatch(succesFn(data));
      })
        .catch((errData) => {
          this.dispatch(failFn(errData));
        });
    });
  }
}
