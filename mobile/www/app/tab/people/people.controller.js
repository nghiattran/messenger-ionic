class PeopleCtrl {
  constructor($http, $scope, $cordovaGeolocation, $ionicLoading, socket, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.Auth = Auth;
    this.$cordovaGeolocation = $cordovaGeolocation;
    
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });

    this.init();
  }

  init() {
    this.$http.get('http://192.168.1.72:9000/api/users').then(response => {
      this.users = response.data;
      // this.getMap();
    });
  }

  addFriend (user){
    this.$http.post('http://192.168.1.72:9000/api/friends', user).then(response => {
      this.users = response.data;
    });
  }
}

angular.module('starter')
  .controller('PeopleCtrl', PeopleCtrl)
  .directive('input', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      'returnClose': '=',
      'onReturn': '&',
      'onFocus': '&',
      'onBlur': '&'
    },
    link: function(scope, element, attr) {
      element.bind('focus', function(e) {
        if (scope.onFocus) {
          $timeout(function() {
            scope.onFocus();
          });
        }
      });
      element.bind('blur', function(e) {
        if (scope.onBlur) {
          $timeout(function() {
            scope.onBlur();
          });
        }
      });
      element.bind('keydown', function(e) {
        if (e.which == 13) {
          if (scope.returnClose) element[0].blur();
          if (scope.onReturn) {
            $timeout(function() {
              scope.onReturn();
            });
          }
        }
      });
    }
  }
})