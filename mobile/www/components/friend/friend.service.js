'use strict';

angular.module('starter')
  .factory('FriendService', function($q, $http, socket, Auth) {
    var friends = null;
    var userLocations = null;
    getFriendLocations();

    function getFriends(cb) {
      cb = cb || function () {};

      if (friends) {
        cb(friends);
      } else {
        return Auth.getCurrentUser((user) => {
          return $http.get('http://192.168.1.72:9000/api/friends').then(response => {
            friends = response.data;
            socket.syncLogin(user._id, friends);
            cb(friends);
          });
        });
      }
    }

    function getFriendLocations (cb) {
      cb = cb || function () {};

      if (userLocations) {
        cb(userLocations);
      } else {
        requestUserLocations(function (locations) {
          userLocations = locations;
        })
      }
    }

    function refreshFriendLocations (cb) {
      cb = cb || function () {};
      requestUserLocations(function (locations) {
        userLocations = locations;
        cb(userLocations)
      })
    }

    function requestUserLocations (cb) {
      return $http.get('http://192.168.1.72:9000/api/userlocations').then(response => {
        cb(response.data);
      });
    }

    return {
      getFriends: getFriends,
      getFriendLocations: getFriendLocations
    }
  })