import {Methods} from '@Services/ApiService.js';

export function apiAction(action, apiAction, endPoint){
    return Object.assign({remoteEndpoint:endPoint, remoteRequiresAuth: false, remoteAction:apiAction, remote: true},action);
}

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
