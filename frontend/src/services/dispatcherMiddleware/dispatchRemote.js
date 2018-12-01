import ApiService from '@Services/ApiService.js';
import {expectHasKeys} from '@Utils/TypeChecks.js';

export default function dispatchRemote(dispatchFn, action){
  if(!('remote' in action)){
    return false;
  }
  //Hard fail when invalid action is given
  if(!expectHasKeys(action,['remoteAction','remoteEndpoint','remoteRequiresAuth'])) 
        throw new Error("Invalid remote action, some required keys are missing");
  
  let {remoteAction, remoteEndpoint, remoteRequiresAuth, remote, ...reqData} = action;
  
  //Dispatch the request
  ApiService.sendCrudRequest(remoteAction, remoteEndpoint, reqData, remoteRequiresAuth )
  .then(data=>{
    let actionData = Object.assign(reqData, {responseData:data});
    try{
      dispatchFn(actionData);
    }
    catch(e){
      console.log("Error in handling dispatched function:");
      console.log(e)
      return Promise.reject(e);
    }
  })
  //Do something more sophisticated
  .catch(errData=>{
    //Dispatch error action if specified
    if('errAction' in action){
      dispatchFn({action: action.errAction, ...errData});
    }
    else if('errCreator' in action){
      dispatchFn(action.errCreator(errData));
    }
    //Otherwise, throw an error
    else{
      console.log(errData);
      throw new Error(errData);
    }
  });
  return true;
}