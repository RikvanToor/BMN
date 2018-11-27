import { Store } from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import { List } from 'immutable';
import AppDispatcher from '@Services/AppDispatcher.js';
import { UserActions, updateKnownUsersAction } from '@Actions/UserActions.js';
import User from '@Models/User.js';

const UPDATE_FLASH = 'UsersStore_UPDATE_FLASH';

/**
 * Stores retrieved data with respect to user
 */
class UsersStore extends Store {
  setFlash(key, value, timeTillResetInSeconds, resetValue='', doEmitChange = true){
    //Clear previous
    if(key in this.flashes){
      clearTimeout(this.flashes[key]);
    }
    this.flashes[key] = setTimeout(()=>{
      this[key] = resetValue;
      AppDispatcher.dispatch({action: UPDATE_FLASH, key: key, val: resetValue});
    },
      timeTillResetInSeconds*1000
    );
    this[key] = value;
    if(doEmitChange) this.__emitChange();
  }
  // Pass global dispatcher to parent class
  constructor(dispatcher) {
    super(dispatcher);
    
    this.flashes = {};

    // List of users
    this.users = new List();

    // Possible error during authentication process
    this.error = '';
    
    this.latestUserDate = new Date();
    
    this.lastCreatedUser = '';
    this.userCreateErrors = {};
  }

  /**
     * Override of base class that is called when handling actions. Remember to not
     * dispatch new actions in this function.
     * @param {object} payload
     */
  __onDispatch(payload) {
    switch (payload.action) {
      case UPDATE_FLASH:
        this[payload.key] = payload.val;
        this.__emitChange();
        break;
      //Succesfully created user
      case UserActions.CREATE_USER:
        this.setFlash('lastCreatedUser', payload.name, 2, '', false);
        this.userCreateErrors = {};
        this.__emitChange();
        break;
      //Handle user creation error as given by the server
      case UserActions.USER_CREATE_FAILED:
        const data = payload.data;
        this.userCreateErrors = data;
        this.__emitChange();
        break;
      // Handle the users request action
      case UserActions.LOAD_USERS:
        console.log('Loading users');
        // Apply the auth request promise and react to it by dispatching new actions
        AppDispatcher.dispatchPromisedFn(
          ApiService.readAuthenticatedData('users'), // Promise to perform
          data => updateKnownUsersAction(data), // Success action
          errData => ({ action: UserActions.LOG_IN_FAIL, msg: errData.msg }), // Fail action
        );
        break;
        // Handles the new found users action. Sets the users list hard, no merging is involved.
      case UserActions.UPDATE_KNOWN_USERS:
        if(payload.users.length === 0) return;
        
        // Create the immutable list.
        this.users = new List(payload.users.map(
          el => new User({
            id: el.id, name: el.name, userName: el.username, email:el.email, isCommittee: el.is_admin > 0,
          }),
        ));
        
        //Determine date of last user create. May be used to query for new users.
        this.latestUserDate = payload.users.reduce((accum,user)=>{
          return accum < user.created_at ? user.created_at : accum;
        },payload.users[0].created_at);

        // Emit the change
        this.__emitChange();
        break;
      default:
        break;
    }
  }
}

export default new UsersStore(AppDispatcher);
