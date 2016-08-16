class FriendsCtrl {
  constructor($http, $ionicPopup, FriendService, Call) {
    // this.$http = $http;
    this.FriendService = FriendService;

    this.init();
  }

  init() {

    this.FriendService.getFriends(friends => {
      this.friends = friends;
    })
      
  }

  makeCall(id) {
    this.Call.makeCall(id)
  }
}

angular.module('starter')
  .controller('FriendsCtrl', FriendsCtrl)