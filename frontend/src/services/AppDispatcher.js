import {Dispatcher} from 'flux';

import ApiService from '@Services/ApiService.js';
import {expectHasKeys} from '@Utils/TypeChecks.js';
class AppDispatcher extends Dispatcher{
    constructor(){
        super();   
    }
    dispatch(action){
        //Handle remote actions separately
        if('remote' in action && action.remote){
            if(!expectHasKeys(action,['remoteAction','remoteEndpoint','remoteRequiresAuth'])) 
                throw new Error("Invalid remote action, some required keys are missing");
            let {remoteAction, remoteEndpoint, remoteRequiresAuth, remote, ...reqData} = action;
            ApiService.sendCrudRequest(remoteAction, remoteEndpoint, reqData, remoteRequiresAuth )
            .then(data=>{
                let actionData = Object.assign(reqData, {responseData:data});
                this.dispatch(actionData);
            })
            //Do something more sophisticated
            .catch(errData=>{
                throw new Error(errData);
            });
        }
        else{
            super.dispatch(action);
        }
    }
    /**
     * Respond to a promise with an action. All resolved data of the promise will be added to the payload.
     * Note that we can call this is the __onDispatch functions of stores, since Promises resolve 
     * at the earliest in the next tick.
     * @param {Promise} promise The promise that was created
     * @param {string} succesActionName Name of the action to perform on success (resolve)
     * @param {string} failActionName Name of the action to perform on failure (reject)
     */
    dispatchPromised(promise, succesActionName, failActionName){
        setTimeout(()=>{
            promise.then(data=>{
                this.dispatch({action: succesActionName, ...data});
            })
            .catch(errData=>{
               this.dispatch({action: failActionName, ...errData}); 
            });
        });
    }
    /**
     * Sames as dispatchPromised, only applies the functions to the returned data to create
     * payloads for the dispatcher. Make sure to set the action key on the payload!
     * @param {Promise} promise The promise that was created
     * @param {function} succesFn Function that creates success payload to be processed
     * @param {function} failFn Function that creates fail payload to be processed
     */
    dispatchPromisedFn(promise, succesFn, failFn){
        setTimeout(()=>{
            promise.then(data=>{
                console.log("Dispatching success");
                console.log(succesFn(data));
                this.dispatch(succesFn(data));
            })
            .catch(errData=>{
               this.dispatch(failFn(errData)); 
            });
        });
    }
}

//Global singleton
const appDispatcher = new AppDispatcher();

export function deferredDispatch(action){
    setTimeout(()=>{
       appDispatcher.dispatch(action); 
    });
}
/**
 * Convenience function that dispatches the action via the global AppDispatcher.
 * @param {object} action Action object, preferably created via an action creator.
 */
export function dispatch(action){
    appDispatcher.dispatch(action);
}

export default appDispatcher;