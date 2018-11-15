import { Store } from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';
import { UserActions, loggedInAction, logInFailAction } from '@Actions/UserActions.js';
import User from '@Models/User.js';

const inst = null;

/**
 * Stores retrieved data with respect to user
 */
class UserStore extends Store {
  static get userInfoPoint() {
    return 'auth/me';
  }

  // Pass global dispatcher to parent class
  constructor(dispatcher) {
    super(dispatcher);

    this.user = new User();
    this.doneFetchingUser = false;

    // Possible error during authentication process
    this.error = '';
  }

  /**
     * Override of base class that is called when handling actions. Remember to not
     * dispatch new actions in this function.
     * @param {object} payload
     */
  __onDispatch(payload) {
    switch (payload.action) {
      // Handle the login action
      case UserActions.LOG_IN:
        AppDispatcher.dispatchPromisedFn(
          ApiService.authRequest(payload.username, payload.password) // Send auth request
            .then(() => ApiService.readData(UserStore.userInfoPoint, {}, true), // Afterwards, read user data
            ),
          data => loggedInAction(data.username, data.name, data.id, data.is_admin != 0), // Success action
          errData => logInFailAction(errData.msg), // Fail action
        );
        break;
      case UserActions.LOG_IN_FAIL:
        this.doneFetchingUser = true;
        this.__emitChange();
        break;
      case UserActions.LOGGED_IN:
        // Merge the immutable with new data
        this.user = this.user.merge({
          userName: payload.userName,
          isCommittee: payload.isCommittee,
          isLoggedIn: true,
          id: payload.id,
          name: payload.name,
        });
        this.doneFetchingUser = true;
        // Emit the change
        this.__emitChange();
        break;
      case UserActions.CHECK_LOG_IN:
        if (ApiService.jwtToken) {
          AppDispatcher.dispatchPromisedFn(
            ApiService.readData(UserStore.userInfoPoint, {}, true),
            data => loggedInAction(data.username, data.name, data.id, data.is_admin != 0),
            errData => logInFailAction(errData.msg),
          );
        } else {
          this.doneFetchingUser = true;
          this.__emitChange();
        }
        break;
        // Handle update password action
      case UserActions.UPDATE_PASSWORD:

        break;
    }
  }
}

export default new UserStore(AppDispatcher);
