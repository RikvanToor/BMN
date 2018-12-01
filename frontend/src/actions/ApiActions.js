import {Methods} from '@Services/ApiService.js';

/**
 * Creates an API action object that will be automatically handled by the AppDispatcher
 * class. Responsedata will be available under 'responseData' in the resulting payload that
 * is dispatched after the request.
 * @type type
 */
export function apiAction(action, apiAction, endPoint){
    return Object.assign({remoteEndpoint:endPoint, remoteRequiresAuth: false, remoteAction:apiAction, remote: true},action);
}

/**
 * Makes the provided action and authorization-required request. Only makes sense
 * on an api action object.
 * @param {object} action The original action object
 * @returns {object} The modified action object
 */
export function makeAuth(action){
    return Object.assign(action, {remoteRequiresAuth:true});
}

//CRUD actions
export function createAction(action, endPoint){
    return apiAction(action, Methods.CREATE, endPoint);
}
export function readAction(action, endPoint){
    return apiAction(action, Methods.READ, endPoint);
}
export function updateAction(action, endPoint){
    return apiAction(action, Methods.UPDATE, endPoint);
}
export function deleteAction(action, endPoint){
    return apiAction(action, Methods.DELETE, endPoint);
}
export function postAction(action, endPoint){
    return apiAction(action, Methods.POST, endPoint);
}

//Authenticated variants

export function readAuth(action, endPoint){
    return makeAuth(readAction(action,endPoint));
}
export function createAuth(action, endPoint){
    return makeAuth(createAction(action,endPoint));
}
export function updateAuth(action, endPoint){
    return makeAuth(updateAction(action,endPoint));
}
export function deleteAuth(action, endPoint){
    return makeAuth(deleteAction(action,endPoint));
}
export function postAuth(action, endPoint){
    return makeAuth(postAction(action,endPoint));
}
