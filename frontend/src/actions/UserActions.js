import AppDispatcher from '@Services/AppDispatcher.js';

export const UserActions = {
    LOG_IN : 'LOG_IN',
    LOGGED_IN : 'LOGGED_IN',
    LOG_IN_FAIL : 'LOG_IN_FAIL',
    LOAD_USERS: 'LOAD_USERS',
    UPDATE_KNOWN_USERS: 'UPDATE_KNOWN_USERS',
    UPDATE_PASSWORD: 'UPDATE_PASSWORD'
};


export function logInAction(userName, password){
    return {action: UserActions.LOG_IN, username: userName, password: password};
}

export function loggedInAction(userName, name, id, isCommittee){
    return {action: UserActions.LOGGED_IN, userName: userName, name:name, id:id, isCommittee: isCommittee};
}
export function loadUsersAction(){
    return {action: UserActions.LOAD_USERS};
}
export function updateKnownUsersAction(usersList){
    return {action: UserActions.UPDATE_KNOWN_USERS, users: usersList};
}
export function logInFailAction(reason){
    return {action: UserActions.LOG_IN_FAIL, msg: reason};
}