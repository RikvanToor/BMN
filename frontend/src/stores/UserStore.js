import {Store} from 'flux-utils';
import ApiService from '@Services/ApiService.js';
import AppDispatcher from '@Services/AppDispatcher.js';

const UserActions = {
    LOG_IN : 'LOG_IN',
    UPDATE_PASSWORD: 'UPDATE_PASSWORD'
};

let inst = null;

/**
 * Stores retrieved data with respect to user
 */
class UserStore extends Store{
    //Pass global dispatcher to parent class
    constructor(dispatcher){
        super(dispatcher);
        this.userName = "";
        this.jwtToken = "";
        
        //Flags that the user is a committee member. Since this is easily hackable,
        //make sure to not expose any sensitive data based on this flag only.
        this.isCommittee = false;
        
        this.error = '';
    }
    /**
     * Returns whether the current user is authenticated.
     * @returns {Boolean}
     */
    isAuthenticated(){
        return this.userName !== "" && this.jwtToken;
    }
    /**
     * Override of base class that is called when handling actions. Remember to not 
     * dispatch new actions in this function.
     * @param {object} payload
     */
    __onDispatch(payload){
        switch(payload.action){
            //Handle the login action
            case UserActions.LOG_IN:
                //Perform the special Auth request
                ApiService.authRequest(payload.user, payload.password)
                .then(responseData =>{
                    this.userName = responseData.userName;
                    this.jwtToken = responseData.token;
                    this.userName = responseData.userName;

                })
                .catch(errData =>{
                    this.error = errData.msg;
                });
            
            
                //The store changes anyway
                __emitChange();
                break;
            //Handle update password action
            case UserActions.UPDATE_PASSWORD:
                
                break;
                
        }
    }
}

export default new UserStore(AppDispatcher);