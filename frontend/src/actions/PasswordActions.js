//Api remote actions
import {updateAuth, postAction} from '@Actions/ApiActions.js';
import {format} from '@Utils/StringUtils.js';

export const PasswordActions = {
  CHANGE_PASSWORD : 'CHANGE_PASSWORD',
  REQUEST_NEW_PASSWORD: 'REQUEST_NEW_PASSWORD'
};

const Endpoints = {
  ChangePassword : 'users/{0}/changepassword',
  RequestNewPassword: 'forgotpassword'
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
    email: email
  }, Endpoints.RequestNewPassword);
}