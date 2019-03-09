import ApiService from '@Services/ApiService.js';
import { expectHasKeys } from '@Utils/TypeChecks.js';

const TOKEN_EXPIRED_MSG = 'Token expired';

export default function dispatchRemote(tokenExpiredAction) {
  return (dispatchFn, action) => {
    if (!('remote' in action)) {
      return false;
    }
    // Hard fail when invalid action is given
    if (!expectHasKeys(action, ['remoteAction', 'remoteEndpoint', 'remoteRequiresAuth'])) { throw new Error('Invalid remote action, some required keys are missing'); }

    const {
      remoteAction, remoteEndpoint, remoteRequiresAuth, remote, ...reqData
    } = action;

    // Dispatch the request
    ApiService.sendCrudRequest(remoteAction, remoteEndpoint, reqData, remoteRequiresAuth)
      .then((data) => {
        const actionData = Object.assign(reqData, { responseData: data });
        try {
          dispatchFn(actionData);
        } catch (e) {
          console.log('Error in handling dispatched function:');
          console.log(e);
          return Promise.reject(e);
        }
      })
    // Do something more sophisticated
      .catch((errData) => {
        // Check if the fail was due to a token expiration.
        if ('msg' in errData && errData.msg === TOKEN_EXPIRED_MSG) {
          dispatchFn(tokenExpiredAction);
        }
        // Dispatch error action if specified
        else if ('errAction' in action) {
          dispatchFn({ action: action.errAction, ...errData });
        } else if ('errCreator' in action) {
          dispatchFn(action.errCreator(errData));
        }
        // Otherwise, throw an error
        else {
          console.log(errData);
          throw new Error(errData);
        }
      });
    return true;
  };
}
