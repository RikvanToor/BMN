import {createAuth} from '@Actions/ApiActions.js';

export const UserActions = {
  LOG_IN: 'LOG_IN',
  LOGGED_IN: 'LOGGED_IN',
  CHECK_LOG_IN: 'CHECK_LOG_IN',
  LOG_IN_FAIL: 'LOG_IN_FAIL',
  LOAD_USERS: 'LOAD_USERS',
  UPDATE_KNOWN_USERS: 'UPDATE_KNOWN_USERS',
  UPDATE_PASSWORD: 'UPDATE_PASSWORD',
  CREATE_USER: 'CREATE_USER',
  USER_CREATE_FAILED: 'USER_CREATE_FAILED',
  LOG_OUT:'LOG_OUT',
  IMPORT_USERS: 'IMPORT_USERS'
};

//API endpoints
const Endpoints = {
  createUser : 'users/create',
  importUsers: 'users/importcsv'
};

export function logOut(){
  return {action : UserActions.LOG_OUT};
}

export function logInAction(userName, password) {
  return { action: UserActions.LOG_IN, username: userName, password };
}
export function loggedInAction(userName, name, id, isCommittee) {
  return {
    action: UserActions.LOGGED_IN, userName, name, id, isCommittee,
  };
}
export function importUsers(file, nameCol, emailCol){
  return createAuth({
    action: UserActions.IMPORT_USERS,
    nameColumn: nameCol,
    emailColumn: emailCol,
    usersFile: file
  },Endpoints.importUsers);
}

export function checkLoginAction() {
  return { action: UserActions.CHECK_LOG_IN };
}
export function loadUsersAction() {
  return { action: UserActions.LOAD_USERS };
}
export function updateKnownUsersAction(usersList) {
  return { action: UserActions.UPDATE_KNOWN_USERS, users: usersList };
}
export function logInFailAction(reason) {
  return { action: UserActions.LOG_IN_FAIL, msg: reason };
}
export function createUser(userObject){
  return createAuth(
          {action:UserActions.CREATE_USER, errAction:UserActions.USER_CREATE_FAILED, ...userObject}
          , Endpoints.createUser );
}