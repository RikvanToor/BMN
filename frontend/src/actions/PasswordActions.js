//Api remote actions
import {updateAuth, postAction} from '@Actions/ApiActions.js';
import {format} from '@Utils/StringUtils.js';

export const PasswordActions = {
  CHANGE_PASSWORD : 'CHANGE_PASSWORD',
  REQUEST_NEW_PASSWORD: 'REQUEST_NEW_PASSWORD',
  SET_NEW_PASSWORD: 'SET_NEW_PASSWORD',
  REQUEST_PASSWORD_FAIL : 'REQUEST_PASSWORD_FAIL'
};

const Endpoints = {
  ChangePassword : 'users/{0}/changepassword',
  RequestNewPassword: 'forgotpassword',
  SetNewPassword: 'setnewpassword/{0}',
};

export function changePassword(userId, password){
  return updateAuth(
          {
            action: PasswordActions.CHANGE_PASSWORD,
            password: password
          }
    , format(Endpoints.ChangePassword,userId));
}

export function requestNewPassword(email){
  return postAction({
    action: PasswordActions.REQUEST_NEW_PASSWORD,
    email: email,
    errAction: PasswordActions.REQUEST_PASSWORD_FAIL
  }, Endpoints.RequestNewPassword);
}

export function setNewPassword(password, token){
  return postAction({
    action: PasswordActions.SET_NEW_PASSWORD,
    password: password
  }, format(Endpoints.SetNewPassword,token));
}