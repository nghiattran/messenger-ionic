class CallController {
  constructor($state, $http, $ionicPopup, $stateParams, Call) {
    this.Call = Call;
    this.display = {};
    this.callState = this.Call.state;
    console.log('hi');
    if (this.callState.myState.state === 'free') {
      $state.go('tab.chats')
    };

  }

  hangup() {
    this.Call.hangup()
  }

  pickup() {
    this.Call.pickup()
  }
}

angular.module('starter')
  .controller('CallCtrl', CallController);
