'use strict';

(function() {

function UserResource($resource) {
  return $resource('http://192.168.1.72:9000/api/users/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    }
  });
}

angular.module('starter.auth')
  .factory('User', UserResource);

})();
