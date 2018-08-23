import {Store} from 'flux/utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';
import {UserActions, loggedInAction, logInFailAction} from '@Actions/UserActions.js';
import User from '@Models/User.js';

let inst = null;

/**
 * Stores retrieved data with respect to user
 */
class UserStore extends Store{
    static get userInfoPoint() {
        return 'auth/me';
    }
    //Pass global dispatcher to parent class
    constructor(dispatcher){
        super(dispatcher);
        
        this.user = new User();

        //Possible error during authentication process
        this.error = '';
    }
    /**
     * Override of base class that is called when handling actions. Remember to not 
     * dispatch new actions in this function.
     * @param {object} payload
     */
    __onDispatch(payload){
        console.log('Handling payload ' + payload.action);
        switch(payload.action){
            //Handle the login action
            case UserActions.LOG_IN:
                console.log('Sending login request');
                
                AppDispatcher.dispatchPromisedFn(
                    ApiService.authRequest(payload.username, payload.password) //Send auth request
                    .then(()=>{
                        console.log('Sending auth/me request');
                        return ApiService.readData(UserStore.userInfoPoint,{}, true); //Afterwards, read user data
                    }),
                    data=>{
                        console.log('Auth/me data');
                        console.log(data);
                        return loggedInAction(data.username, data.name, data.id, data.is_admin != 0);
                    }, //Success action
                    errData=> { 
                        return logInFailAction(errData.msg);
                    } //Fail action
                );
                break;
            case UserActions.LOG_IN_FAIL:
                console.log("Failed action");
                console.log(payload);
                break;
            case UserActions.LOGGED_IN:
                //Merge the immutable with new data
                this.user = this.user.merge({
                    userName : payload.userName,
                    isCommittee: payload.isCommittee,
                    isLoggedIn: true,
                    id: payload.id,
                    name: payload.name
                });
                console.log(this.user.toJS());
                //Emit the change
                this.__emitChange();
                break;
            //Handle update password action
            case UserActions.UPDATE_PASSWORD:
                
                break;
                
        }
        console.log('Done handling ' + payload.action);
    }
}

export default new UserStore(AppDispatcher);