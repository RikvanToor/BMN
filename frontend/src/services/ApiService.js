
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
        return '';
    }
    constructor(){
        //Save the JWT token here
        this.jwtToken = "";
        
        //API basepath
        if (process.env.NODE_ENV === "production"){
            this.basePath = "https://bmn.a-eskwadraat.nl/api/";
        }
        else{
            this.basePath = "http://localhost:8080";
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
     * @returns {Promise}
     */
    authRequest(user, pass){
        return sendRequest(Methods.POST, ApiService.authPath, {username: user, password: pass}, false)
            .then(data=>{
           this.jwtToken = data.token; //Check specifics of API     
        });
    }
    /**
     * Sends an asynchronous request to the server with the given parameters. Returns a 
     * promise with the result.
     * @param {int} crudMethod The method to use. On of the Methods enumeration.
     * @param {string} endpoint The endpoint to send the request to. Omit slash at start!
     * @param {object} params Parameters to send with the request
     * @param {boolean} requiresAuth Whether the request requires authentication in the form of a JWT token
     * @returns {Promise} 
     */
    sendRequest(crudMethod, endpoint, params, requiresAuth) {
        // Return a new promise.
        return new Promise(function(resolve, reject) {
            //Setup the XHR object
            var req = new XMLHttpRequest();

            //TODO: validate endpoint here? Or let it fail with the request
            req.open(ApiService.getRequestMethod(crudMethod), this.basePath + endpoint);

            if(requiresAuth){
                if(!this.jwtToken){
                    reject(ApiError('Trying to send authenticated request without token.',-1));
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
                // Resolve the promise with the response text
                resolve(req.response);
              }
              else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(req.statusText));
              }
            };

            // Handle network errors
            req.onerror = function() {
              reject(Error("Network Error"));
            };

            //Setup content type for parameters
            if(Object.keys(params).length > 0){
                req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); //Is this appropriate?
                paramsStringArray = Object.keys(params).map(function(key){
                    return key + '=' + params[key];
                });
                paramsString = encodeURIComponent(paramsStringArray.join('&'));
                req.send(paramsString);
            }
            //Regular parameterless request
            else{
                req.send();
            }
          
        });
      }
    
    readData(apiEndpoint, params, requiresAuth){
        return sendRequest(Methods.READ, apiEndpoint, params, requiresAuth);
    }  
    
    //For now, assume all update, create and delete actions require an authorized user.
    //This may change when we incorporate the ticketsystem or non-auth forms.
    
    
    updateData(apiEndpoint, params){
        return sendRequest(Methods.UPDATE, apiEndpoint, params, true);
    }
    createData(apiEndpoint, params){
        return sendRequest(Methods.CREATE, apiEndpoint, params, true);
    }
    deleteData(apiEndpoint, params){
        return sendRequest(Methods.DELETE, apiEndpoint, params, true); 
    }
}
//Singleton
const service = new ApiService();

export default service;