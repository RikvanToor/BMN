import {Store} from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import {List} from 'immutable';
import AppDispatcher from '@Services/AppDispatcher.js';
import {UserActions, updateKnownUsersAction} from '@Actions/UserActions.js';
import User from '@Models/User.js';

let inst = null;

/**
 * Stores retrieved data with respect to user
 */
class UsersStore extends Store{
    //Pass global dispatcher to parent class
    constructor(dispatcher){
        super(dispatcher);
        
        //List of users
        this.users = new List();

        //Possible error during authentication process
        this.error = '';
    }
    /**
     * Override of base class that is called when handling actions. Remember to not 
     * dispatch new actions in this function.
     * @param {object} payload
     */
    __onDispatch(payload){
        switch(payload.action){
            //Handle the users request action
            case UserActions.LOAD_USERS:
                
                //Apply the auth request promise and react to it by dispatching new actions
                AppDispatcher.dispatchPromisedFn(
                    ApiService.readData('users',{},true), //Promise to perform
                    data=>{return updateKnownUsersAction(data);}, //Success action
                    errData=>{ return{action:UserActions.LOG_IN_FAIL, msg:errData.msg}; } //Fail action
                );
                break;
            //Handles the new found users action. Sets the users list hard, no merging is involved.
            case UserActions.UPDATE_KNOWN_USERS:
                //Create the immutable list.
                this.users = new List(payload.users.map(
                            el=>{
                                return new User({id:el.id, name:el.name, userName:el.username, isCommittee: el.is_admin > 0});
                            }
                        ));
                
                //Emit the change
                this.__emitChange();
                break;
                
        }
    }
}

export default new UsersStore(AppDispatcher);