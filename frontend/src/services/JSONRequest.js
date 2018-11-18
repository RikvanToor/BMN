import {toPhpString} from '@Utils/DateTimeUtils.js';
/**
 * Class for distinguishing errors originating from the ApiService class.
 * @type type
 */
class JSONRequestError {
  constructor(message, httpCode) {
    // Error message
    this.message = message;
    // Possible HTTP request status code, or -1 if not relevant
    this.httpCode = httpCode;
  }
}

/**
 * Recursively fills the FormData object for sending via XMLHttpRequest
 * @param {FormData} formDataObj The form data object
 * @param {object} obj The data object to encode in the FormData object
 * @param {string} prefix Prefix for the keys of the object.
 */
function objectToFormData(formDataObj, obj, prefix=''){
  const hasPrefix = prefix.length !== 0;
  let newKeyName = (name)=>hasPrefix ? '[' + name + ']' : name;
  
  if(!(obj instanceof Object) && !Array.isArray(obj)){
    formDataObj.append(prefix, obj);
    return;
  }
  
  Object.keys(obj).forEach((key)=>{
    if(obj[key] instanceof Object && !(obj[key] instanceof Date)){
      objectToFormData(formDataObj, obj[key],prefix+newKeyName(key));
    }
    else if(Array.isArray(obj[key])){
      for(let i =0; i < obj[key].length; i++){
        objectToFormData(formDataObj, obj[key],prefix+newKeyName(key)+'['+i+']');
      }
    }
    else if(obj[key] instanceof Date){
      formDataObj.append(prefix + newKeyName(key), toPhpString(obj[key]));
    }
    else{
      formDataObj.append(prefix + newKeyName(key), obj[key]);
    }
  });
}

/**
 * JSON request class that sends an asynchronous JSON request to a server.
 * @type type
 */
class JSONRequest {
  /**
     * Creates the JSON request.
     * @param {object} params Optional parameter object
     * @returns {JSONRequest}
     */
  constructor(params) {
    if (typeof params !== 'undefined') {
      this.params = params;
    } else {
      this.params = {};
    }
    this.jwtToken = '';
    this.resolve = '';
    this.reject = '';
  }

  /**
     * Converts an object with parameters to a FormData object
     * @param {object} paramObject The parameter object.
     * @returns {FormData} The FormData object to send.
     */
  static getUrlParameters(paramObject) {
    let data = new FormData();
    objectToFormData(data,paramObject,'');
    return data;
  }

  /**
     * Internal function for creating basic request
     * @param {string} sendMethod The send method to use
     * @param {string} endPoint The endpoint to send to
     * @returns {XMLHttpRequest} Created XHR object
     */
  __getBasicRequest(sendMethod, endPoint) {
    // Setup the XHR object
    const req = new XMLHttpRequest();
    // TODO: validate endpoint here? Or let it fail with the request
    req.open(sendMethod, endPoint);

    // Add headers
    req.setRequestHeader('Accept', 'application/json');

    // Handle the response. Both resolve and reject will be set later when
    // a Promise is available
    req.onload = () => {
      // Check the status code, since this is called on all responses.
      let statusCodeOrder = Math.floor(req.status/100);
      
      //Any 2XX codes should be fine
      if (statusCodeOrder === 2) {
        try {
          // Parse JSON automatically.
          const data = JSON.parse(req.response);
          
          this.resolve(data);
        } catch (e) {
          this.reject(new JSONRequestError('Failed to decode response', -1));
        }
      } else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        this.reject(new JSONRequestError(req.statusText, req.status));
      }
    };

    // Handle network errors
    req.onerror = () => {
      this.reject(new JSONRequestError('Network Error', -1));
    };
    return req;
  }

  /**
     * Internally sends the request, possibly adding parameters to the request, encoded as
     * form parameters in the url.
     * @param {XMLHttpRequest} request The request object
     */
  __sendRequest(request) {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      if (Object.keys(this.params).length > 0) {
        const data = JSONRequest.getUrlParameters(this.params);
        request.send(data);
      } else {
        request.send();
      }
    });
  }

  /**
     * Sets the parameters on this object
     * @param {object} params Parameter object
     */
  setParams(params) {
    this.params = params;
  }

  /**
     * Sets the JWT token to be used on this request object.
     * @param {type} token
     * @returns {undefined}
     */
  setJWTToken(token) {
    this.jwtToken = token;
  }

  /**
     * Sends an authenticated request
     * @param {string} requestMethod The request method to use (i.e. 'GET', 'POST', etc.)
     * @param {string} endPoint The endpoint to send the request to
     * @returns {JSONRequest} Returns a promise, resolving on success or rejecting on error
     */
  sendAuthenticated(requestMethod, endPoint) {
    if (this.jwtToken.size === 0) {
      throw new JSONRequestError('Trying to send JSON authenticated request without token', -1);
    }
    const req = this.__getBasicRequest(requestMethod, endPoint);
    // Set the JWT token
    req.setRequestHeader('Authorization', `Bearer ${this.jwtToken}`);

    return this.__sendRequest(req);
  }

  /**
     * Sends an unauthenticated request
     * @param {string} requestMethod The request method to use (i.e. 'GET', 'POST', etc.)
     * @param {string} endPoint The endpoint to send the request to
     * @returns {JSONRequest} Returns a promise, resolving on success or rejecting on error
     */
  send(requestMethod, endPoint) {
    return this.__sendRequest(this.__getBasicRequest(requestMethod, endPoint));
  }
}
export default JSONRequest;
