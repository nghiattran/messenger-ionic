'use strict';

angular.module('starter', [
  'starter.auth',
  'starter.constants',
  'ngResource',
  'ionic',
  'btford.socket-io',
  'LocalStorageModule',
  'ngCordova',
  'angularMoment'
])
  .config(function($urlRouterProvider, $locationProvider, $stateProvider) {
    $urlRouterProvider
      .otherwise('/tab/chats');

    // $locationProvider.html5Mode(true);
    
    $stateProvider
      .state('call', {
        url: '/call',
        templateUrl: 'app/call/call.html',
        controller: 'CallCtrl',
        controllerAs: 'Ctrl'
      })
  })
  .run(function($ionicPlatform, $rootScope, $cordovaContacts, $ionicPopup, Auth, ContactsService, LocationService) {

    $ionicPlatform.ready(() => {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      // ContactsService.find()
      //   .then(contacts => {
      //     console.log(contacts);
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   })
    });
  })
  .filter('chat', function() {
    return function(items) {
      var filtered = [];
      angular.forEach(items, function(item) {
        if(item.lastMessage) {
          filtered.push(item);
        }
      });
      return filtered;
    };
  });