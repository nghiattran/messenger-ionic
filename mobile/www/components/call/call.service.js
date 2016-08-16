'use strict';

angular.module('starter')
.factory('Call', function($state, $http, $ionicPopup, Auth, socket) {
  // State pattern, 
  // 'free' <-- 'wait' --> 'joined'
  // 'joined' --> 'free'
  //  'free' --> 'wait'

  /**
   * JoinedState: when user engage conversation.
   */
  class JoinedState {
    constructor(callObj) {
      this.callObj = callObj;
      this.state = 'joined';
      this.time = new Date();
      console.log(this.time);

      if ($state.current.name !== 'call') {
        $state.go('call');
      };

      // Setup SimpleWebRTC
      this.webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'my-video',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: 'their-video',
        // immediately ask for camera access
        autoRequestMedia: true,
        muted: true
      });

      // webrtc.mute();
      this.webrtc.on('readyToCall', () => {
        this.webrtc.joinRoom(callObj.aCall.room);
      });

      this.webrtc.on('videoRemoved', (videoEl, peer) => {
        // Since this is peer-to-peer conversation, hang up whenever a peer leaves
        sendHangupRequest(this.callObj.aCall._id);
      })
    }

    nextState(context, callObj) {
      if (callObj.event === 'updated') {
        if (callObj.aCall.status === 'ended') {
          context.myState = new FreeState(callObj);
          closeConnection(this.webrtc);
        } else {
          console.log('Unexpected');
        }
      } else {
        console.log('Unexpected');
      }
    }
  }

  /**
   * FreeState: when user is not in any call
   */
  class FreeState {
    constructor(callObj) {
      this.callObj = callObj;
      this.state = 'free';
    }

    nextState(context, callObj) {
      if (callObj.event === 'created') {
        context.myState = new WaitState(callObj);
      } else {
        console.log('Unexpected');
      }
    }
  }

  /**
   * WaitState: this state fired whenever user calls someone or is called
   * For caller: this displays waiting screen
   * For callee: displays a popup asking whether to take the call
   */
  class WaitState {
    constructor(callObj) {
      this.callObj = callObj;
      this.state = 'wait';

      this.handleRequest(callObj)
    }

    handleRequest(callObj) {
      if (callObj.aCall.isCaller) {
        this.handleRequestCaller(callObj);
      } else {
        this.handleRequestCallee(callObj);
      }
    }

    handleRequestCaller(callObj) {
      $state.go('call');
    }

    handleRequestCallee(callObj) {
      $state.go('call');
    }

    nextState(context, callObj) {
      console.log(callObj.event, callObj.aCall.status);
      if (callObj.event === 'updated') {

        if (callObj.aCall.status === 'joined') {
          context.myState = new JoinedState(callObj);
        } else if (callObj.aCall.status === 'ended') {
          // Call ended before callee pickup
          context.myState = new FreeState(callObj);
          $state.go('tab.chats');
        } else {
          console.log('Unexpected');
        }

      } else {
        console.log('Unexpected');
      }
    }
  }

  class StateContext {
    constructor() {
      this.setState(new FreeState({myId}))
    }

    setState(newState) {
      this.myState = newState;
    }

    nextState(callObj) {
      this.myState.nextState(this, callObj);
    }

    getStatus() {
      return this.myState.state;
    }
  }

  var myId;
  var isReady = false;
  var webrtc;
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  var myStatus;
  myStatus = new StateContext();

  // Listen for call
  Auth.myId(function (id) {
    myId = id;
    console.log(myStatus.getStatus());

    socket.syncUpdates(myId + ':peercall', [], function (event, aCall) {
      if (aCall.callerId === myId) {
        aCall.isCaller = true;
      } else {
        aCall.isCaller = false;
      }

      if (aCall.isCaller) {
        myStatus.display = {
          name: aCall.calleeName,
          email: aCall.calleeEmail,
          imageUrl: aCall.calleeImageUrl,
        }
      } else {
        myStatus.display = {
          name: aCall.callerName,
          email: aCall.callerEmail,
          imageUrl: aCall.callerImageUrl,
        }
      }
      console.log(aCall);

      myStatus.nextState({event, aCall, myId})
      console.log(myStatus.getStatus());
    })
  })

  function isWebcam (cb) {
    navigator.getUserMedia({video: true}, function() {
      cb(true);
    }, function() {
      cb(false);
    });
  }
  

  function makeCall (userId) {
    // Check if webcam is enabled,
    // if not, promt user
    // if yes, advance
    // isWebcam(function (isAvailable) {
    //   console.log(isAvailable);
    //   if (isAvailable) {
    //     // call(userId);
    //   } else {
    //     // TODO: promt enable webcam
    //   }
    // })
    
    call(userId);
  }

  function call (userId) {
    var data = {
      callee: userId,
      room: chance.string({length: 10})
    };

    if (myId) {
      data.caller = myId;
      sendRequest(data);
    } else {
      Auth.myId(function (id) {
        myId = id;
        data.caller = myId;
        sendRequest(data);
      })
    }
  }

  window.onbeforeunload = function (event) {
    if (myStatus.myState.state !== 'free') {
      sendHangupRequest(myStatus.myState.callObj.aCall._id);
    }
  };


  function sendRequest (data) {
    $http.post('http://192.168.1.72:9000/api/peercalls', data)
      .then(response => {
    
      })
      .catch(error => {
        console.log(error);
        $state.go('tab.chats');
      })
  }

  function closeConnection (webrtc) {
    webrtc.leaveRoom();
    webrtc.stopLocalVideo();
    webrtc.disconnect();
    $state.go('tab.chats');
  }

  function sendHangupRequest (callid) {
    // myStatus.myState.callObj.aCall._id
    var data = {status: 'ended'};

    // If state 'joined', this mean conversation has begun
    if (myStatus.myState.state === 'joined') {
      var now = new Date();
      data.duration = now - myStatus.myState.time;
    }
    
    var url = 'http://192.168.1.72:9000/api/peercalls/' + callid;
    $http.put(url, data)
      .then(response => {

      })
      .catch(error => {
        console.log(error);
      })
  }

  function hangup () {
    if (myStatus.myState.state !== 'free') {
      sendHangupRequest(myStatus.myState.callObj.aCall._id);
    };
  }

  function pickup () {
    if (myStatus.myState.state !== 'waiting') {
      var url = 'http://192.168.1.72:9000/api/peercalls/' + myStatus.myState.callObj.aCall._id;
      $http.put(url, {status: 'joined'})
    };
  }

  return {
    makeCall: makeCall,
    hangup: hangup,
    state: myStatus,
    pickup:pickup
  }
})