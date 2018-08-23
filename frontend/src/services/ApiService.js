
const Methods = {
    CREATE : 0,
    READ : 1,
    UPDATE: 2,
    DELETE: 3
};

/**
 * Class for distinguishing errors originating from the ApiService class.
 * @type type
 */
class ApiError{
    constructor(message, httpCode){
        //Error message
        this.message = message;
        //Possible HTTP request status code, or -1 if not relevant
        this.httpCode = httpCode;
    }
}

/**
 * Api service class for interacting with the BMN Api on the server.
 */
class ApiService{
    static get authPath(){
        return 'auth/login';
    }
    constructor(){
        //Save the JWT token here when acquired
        this.jwtToken = "";
        
        //API basepath, will be processed by webpack accordingly
        if (process.env.NODE_ENV === "production"){
            this.basePath = "https://bmn.a-eskwadraat.nl/api/";
        }
        else{
            this.basePath = "http://localhost:8080/api/";
        }
    }
    /**
     * Returns the appropriate request method for the given CRUD method
     * @param {int} crudMethod One of the Methods enumeration
     * @returns {String} String of request method to use. Invalid method defaults to GET.
     */
    static getRequestMethod(crudMethod){
        switch(crudMethod){
            case Methods.CREATE:
            case Methods.UPDATE:
                return "POST";
            case Methods.READ:
                return "GET";
            case Methods.DELETE:
                return "DELETE";
            default:
                return "GET";
        }
    }
    
    /**
     * Perform the special authentication request, which results in a JWT token to be used
     * in subsequent authorization calls. 
     * TODO: does JWT expire?
     * @param {string} user
     * @param {string} pass
     * @returns {Promise} Promise that is resolved with a JS object with token and username, or rejected
     *  with an ApiError class instance.
     */
    authRequest(user, pass){
        return this.sendRequest('POST', ApiService.authPath, {username: user, password: pass}, false)
        .then(data=>{
            try{
                this.jwtToken = data.token;
            }
            catch(e){
                return Promise.reject(new ApiError("Could not decode JSON response for authentication",-1));
            }
           
           //Return meaningful data to 
           return Promise.resolve({token:data.token, username:user});
        });
    }
    
    /**
     * Specialized version sending CRUD requests
     * @param {int} crudMethod The crud method, one of the enum Methods.
     * @param {string} endpoint API endpoint to send request to
     * @param {object} params Data to send with the request
     * @param {boolean} requiresAuth Whether the request requires authentication in the form of a JWT token
     * @returns {Promise} Promise resolving to JSON parsed response object or rejecting with an API error 
     * object describing the problem
     */
    sendCrudRequest(crudMethod, endpoint, params, requiresAuth){
        return this.sendRequest(ApiService.getRequestMethod(crudMethod), endpoint, params, requiresAuth)
    }
    /**
     * Sends an asynchronous request to the server with the given parameters. Returns a 
     * promise with the result.
     * @param {int} sendMethod The request method to use (i.e. 'GET','POSt', etc.)
     * @param {string} endpoint The endpoint to send the request to. Omit slash at start!
     * @param {object} params Parameters to send with the request
     * @param {boolean} requiresAuth Whether the request requires authentication in the form of a JWT token
     * @returns {Promise} Promise resolving to JSON parsed response object or rejecting with an API error 
     * object describing the problem
     */
    sendRequest(sendMethod, endpoint, params, requiresAuth) {
        // Return a new promise.
        return new Promise((resolve, reject) => {
            //Setup the XHR object
            var req = new XMLHttpRequest();
            //TODO: validate endpoint here? Or let it fail with the request
            req.open(sendMethod, this.basePath + endpoint);
            
            console.log('Sending request to ' + this.basePath + endpoint);
            
            //Add headers
            req.setRequestHeader('Accept','application/json');

            //Setup authorized request if needed
            if(requiresAuth){
                if(!this.jwtToken){
                    reject(new ApiError('Trying to send authenticated request without token.',-1));
                }
                else{
                    //Send the JWT token
                    req.setRequestHeader('Authorization', 'Bearer ' + this.jwtToken);
                }
            }

            //Handle the response
            req.onload = function() {
              //Check the status code, since this is called on all responses.
              if (req.status === 200) {
                console.log("Response:" + req.response);
                
                try{
                    //Parse JSON automatically.
                    let data = JSON.parse(req.response);
                    resolve(data);
                }
                catch(e){
                    reject(new ApiError('Failed to decode response', -1));
                }
              }
              else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(new ApiError(req.statusText, req.status));
              }
            };

            // Handle network errors
            req.onerror = function() {
              reject(new ApiError("Network Error", -1));
            };

            //Setup content type for parameters
            if(Object.keys(params).length > 0){
                req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); //Is this appropriate?
                const paramsStringArray = Object.keys(params).map(function(key){
                    return key + '=' + params[key];
                });
                const paramsString = paramsStringArray.join('&');
                req.send(paramsString);
            }
            //Regular parameterless request
            else{
                req.send();
            }
          
        });
      }
    
    readData(apiEndpoint, params, requiresAuth){
        return this.sendCrudRequest(Methods.READ, apiEndpoint, params, requiresAuth);
    }  
    
    //For now, assume all update, create and delete actions require an authorized user.
    //This may change when we incorporate the ticketsystem or non-auth forms.
    
    
    updateData(apiEndpoint, params){
        return this.sendCrudRequest(Methods.UPDATE, apiEndpoint, params, true);
    }
    createData(apiEndpoint, params){
        return this.sendCrudRequest(Methods.CREATE, apiEndpoint, params, true);
    }
    deleteData(apiEndpoint, params){
        return this.sendCrudRequest(Methods.DELETE, apiEndpoint, params, true); 
    }
}
//Singleton
const service = new ApiService();

export default service;