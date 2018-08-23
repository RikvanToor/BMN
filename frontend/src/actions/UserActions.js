import AppDispatcher from '@Services/AppDispatcher.js';

export const UserActions = {
    LOG_IN : 'LOG_IN',
    UPDATE_PASSWORD: 'UPDATE_PASSWORD'
};

/**
 * Dispatch the login action
 * @param {string} userName Username to log in with
 * @param {string} password Password to log in with
 */
export function logIn(userName, password){
    console.log('Dispatching login for ' + userName);
    AppDispatcher.dispatch({action: UserActions.LOG_IN, username: userName, password: password});
}