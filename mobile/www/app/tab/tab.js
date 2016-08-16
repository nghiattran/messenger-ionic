angular.module('starter')
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tab directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'app/tab/tab.html',
    authenticate: true
  })

  // Each tab has its own nav history stack:

  .state('tab.chats', {
    url: '/chats',
    views: {
      'tab-chats': {
        templateUrl: 'app/tab/chat/index.html',
        controller: 'ChatCtrl',
        controllerAs: 'Ctrl'
      }
    },
    onEnter: function ($ionicScrollDelegate) {
      console.log('hi');
      $ionicScrollDelegate.scrollTop();
    },
    authenticate: true
  })
  .state('tab.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'tab-chats': {
        templateUrl: 'app/tab/chat/chat.detail.html',
        controller: 'ChatDetailCtrl',
        controllerAs: 'Ctrl'
      }
    },
    authenticate: true
  })
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'app/tab/account/index.html',
        controller: 'AccountCtrl',
        controllerAs: 'Ctrl'
      }
    },
    authenticate: true
  })
  .state('tab.people', {
    url: '/people',
    views: {
      'tab-people': {
        templateUrl: 'app/tab/people/index.html',
        controller: 'PeopleCtrl',
        controllerAs: 'Ctrl'
      }
    },
    authenticate: true
  })
  .state('tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'app/tab/map/index.html',
        controller: 'MapCtrl',
        controllerAs: 'Ctrl'
      }
    },
    authenticate: true
  });

});
