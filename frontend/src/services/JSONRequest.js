
/**
 * Class for distinguishing errors originating from the ApiService class.
 * @type type
 */
class JSONRequestError{
    constructor(message, httpCode){
        //Error message
        this.message = message;
        //Possible HTTP request status code, or -1 if not relevant
        this.httpCode = httpCode;
    }
}

/**
 * JSON request class that sends an asynchronous JSON request to a server.
 * @type type
 */
class JSONRequest{
    /**
     * Creates the JSON request.
     * @param {object} params Optional parameter object
     * @returns {JSONRequest}
     */
    constructor(params){
        if(typeof params !== 'undefined'){
            this.params = params;
        }
        else{
            this.params = {};
        }
        this.jwtToken = '';
        this.resolve = '';
        this.reject = '';
    }
    
    /**
     * Converts an object with parameters to an URL parameter string
     * @param {object} paramObject The parameter object.
     * @returns {string} The URL parameter string.
     */
    static getUrlParameters(paramObject){
        //TODO maybe add some checking for incorrect values given (i.e. functions)
        const paramsStringArray = Object.keys(paramObject).map(function(key){
            return key + '=' + paramObject[key];
        });
        return paramsStringArray.join('&');
    }
    
    /**
     * Internal function for creating basic request
     * @param {string} sendMethod The send method to use
     * @param {string} endPoint The endpoint to send to
     * @returns {XMLHttpRequest} Created XHR object
     */
    __getBasicRequest(sendMethod, endPoint){
        //Setup the XHR object
        var req = new XMLHttpRequest();
        //TODO: validate endpoint here? Or let it fail with the request
        req.open(sendMethod, endPoint);

        //Add headers
        req.setRequestHeader('Accept','application/json');
        
        //Handle the response. Both resolve and reject will be set later when 
        //a Promise is available
        req.onload = () => {
          //Check the status code, since this is called on all responses.
          if (req.status === 200) {
            try{
                //Parse JSON automatically.
                let data = JSON.parse(req.response);
                this.resolve(data);
            }
            catch(e){
                this.reject(new JSONRequestError('Failed to decode response', -1));
            }
          }
          else {
            // Otherwise reject with the status text
            // which will hopefully be a meaningful error
            this.reject(new JSONRequestError(req.statusText, req.status));
          }
        };

        // Handle network errors
        req.onerror = () => {
          this.reject(new JSONRequestError("Network Error", -1));
        };
        return req;
    }
    /**
     * Internally sends the request, possibly adding parameters to the request, encoded as 
     * form parameters in the url.
     * @param {XMLHttpRequest} request The request object
     */
    __sendRequest(request){
        return new Promise((resolve,reject)=>{
           this.resolve = resolve;
           this.reject = reject;
           if(Object.keys(this.params).length > 0){
                request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); //Is this appropriate?
                request.send(JSONRequest.getUrlParameters(this.params));
            }
            else{
                request.send();
            }
        });
    }
    
    /**
     * Sets the parameters on this object
     * @param {object} params Parameter object
     */
    setParams(params){
        this.params = params;
    }
    /**
     * Sets the JWT token to be used on this request object.
     * @param {type} token
     * @returns {undefined}
     */
    setJWTToken(token){
        this.jwtToken = token;
    }
    /**
     * Sends an authenticated request
     * @param {string} requestMethod The request method to use (i.e. 'GET', 'POST', etc.)
     * @param {string} endPoint The endpoint to send the request to
     * @returns {JSONRequest} Returns a promise, resolving on success or rejecting on error
     */
    sendAuthenticated(requestMethod, endPoint){
        if(this.jwtToken.size === 0){
            throw new JSONRequestError("Trying to send JSON authenticated request without token", -1);
        }
        let req = this.__getBasicRequest(requestMethod, endPoint);
        //Set the JWT token
        req.setRequestHeader('Authorization', 'Bearer ' + this.jwtToken);
        
        return this.__sendRequest(req);
    }
    
    /**
     * Sends an unauthenticated request
     * @param {string} requestMethod The request method to use (i.e. 'GET', 'POST', etc.)
     * @param {string} endPoint The endpoint to send the request to
     * @returns {JSONRequest} Returns a promise, resolving on success or rejecting on error
     */
    send(requestMethod, endPoint){
        return this.__sendRequest( this.__getBasicRequest(requestMethod, endPoint) );
    }
}
export default JSONRequest;