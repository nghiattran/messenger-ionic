'use strict';

(function() {

function authInterceptor($rootScope, $q, localStorageService, $injector, Util) {
  var state;
  return {
    // Add authorization token to headers
    request(config) {
      config.headers = config.headers || {};
      
      if (localStorageService.get('token')) {
        config.headers.Authorization = 'Bearer ' + localStorageService.get('token');
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError(response) {
      if (response.status === 401) {
        (state || (state = $injector.get('$state'))).go('login');
        // remove any stale tokens
        localStorageService.remove('token');
      }
      return $q.reject(response);
    }
  };
}

angular.module('starter.auth')
  .factory('authInterceptor', authInterceptor);

})();
