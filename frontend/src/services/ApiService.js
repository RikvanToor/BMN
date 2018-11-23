import JSONRequest from '@Services/JSONRequest.js';

export const Methods = {
  CREATE: 0,
  READ: 1,
  UPDATE: 2,
  DELETE: 3,
  POST: 4,
};

/**
 * Class for distinguishing errors originating from the ApiService class.
 * @type type
 */
class ApiError {
  constructor(message, httpCode) {
    // Error message
    this.message = message;
    // Possible HTTP request status code, or -1 if not relevant
    this.httpCode = httpCode;
  }
}

/**
 * Api service class for interacting with the BMN Api on the server.
 */
class ApiService {
  static get authPath() {
    return 'auth/login';
  }

  constructor() {
    // Save the JWT token here when acquired
    this.jwtToken = window.sessionStorage.getItem('jwtToken');

    // API basepath, will be processed by webpack accordingly
    if (process.env.NODE_ENV === 'production') {
      // this.basePath = "https://bmn.a-eskwadraat.nl/api/";
      this.basePath = 'https://bmn.rikvantoor.nl/public/api/';
    } else {
      this.basePath = 'http://localhost:9000/api/';
    }
  }

  /**
     * Returns the appropriate request method for the given CRUD method
     * @param {int} crudMethod One of the Methods enumeration
     * @returns {String} String of request method to use. Invalid method defaults to GET.
     */
  static getRequestMethod(crudMethod) {
    switch (crudMethod) {
      case Methods.CREATE:
      case Methods.POST:
      case Methods.UPDATE:
        return 'POST';
      case Methods.READ:
        return 'GET';
      case Methods.DELETE:
        return 'DELETE';
      default:
        return 'GET';
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
  authRequest(user, pass) {
    // Setup request with parameters
    const req = new JSONRequest({ username: user, password: pass });

    return req.send('POST', this.basePath + ApiService.authPath)
      .then((data) => {
        try {
          this.jwtToken = data.token;
          window.sessionStorage.setItem('jwtToken', data.token);
        } catch (e) {
          return Promise.reject(new ApiError('Could not decode JSON response for authentication', -1));
        }

        // Return meaningful data to
        return Promise.resolve({ token: data.token, username: user });
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
  sendCrudRequest(crudMethod, endpoint, params, requiresAuth) {
    return this.sendRequest(ApiService.getRequestMethod(crudMethod),
      endpoint, params, requiresAuth);
  }

  /**
     * Sends an asynchronous request to the server with the given parameters. Returns a
     * promise with the result.
     * @param {int} sendMethod The request method to use (i.e. 'GET','POSt', etc.)
     * @param {string} endPoint The endpoint to send the request to. Omit slash at start!
     * @param {object} params Parameters to send with the request
     * @param {boolean} requiresAuth Whether the request requires authentication in the form of a JWT token
     * @returns {Promise} Promise resolving to JSON parsed response object or rejecting with an API error
     * object describing the problem
     */
  sendRequest(sendMethod, endPoint, params, requiresAuth) {
    const req = new JSONRequest(params);
    const absoluteEndPoint = this.basePath + endPoint;
    if (requiresAuth) {
      req.setJWTToken(this.jwtToken);
      return req.sendAuthenticated(sendMethod, absoluteEndPoint);
    }

    return req.send(sendMethod, absoluteEndPoint);
  }

  readData(apiEndpoint, params, requiresAuth) {
    return this.sendCrudRequest(Methods.READ, apiEndpoint, params, requiresAuth);
  }

  readAuthenticatedData(apiEndpoint, params) {
    return this.readData(apiEndpoint, params, true);
  }

  // For now, assume all update, create and delete actions require an authorized user.
  // This may change when we incorporate the ticketsystem or non-auth forms.


  updateData(apiEndpoint, params) {
    return this.sendCrudRequest(Methods.UPDATE, apiEndpoint, params, true);
  }

  createData(apiEndpoint, params) {
    return this.sendCrudRequest(Methods.CREATE, apiEndpoint, params, true);
  }

  deleteData(apiEndpoint, params) {
    return this.sendCrudRequest(Methods.DELETE, apiEndpoint, params, true);
  }
}
// Singleton
const service = new ApiService();

export default service;
