class ChatDetailCtrl {
  constructor($stateParams, $http, $ionicScrollDelegate, socket, Auth, Chats, $state) {
    this.$http = $http;
    this.socket = socket;
    this.$ionicScrollDelegate = $ionicScrollDelegate;
    this.$state = $state;
    this.messages = {};
    this.Chats = Chats;

    this.tmpConId = $stateParams.chatId;
    
    console.log('hi');
    if (!this.tmpConId.startsWith('user_')) {
      Auth.myId()
        .then(id=> {
          this.myId = id;
          this.init();
        })
    };
  }

  init() {
    this.addChat();
  }

  addChat() {
    this.Chats.addChat(this.tmpConId, this.myId, (messages)=> {
      // this.$ionicScrollDelegate.scrollBottom(true);
      this.messages = messages;
    },()=> {
      this.$ionicScrollDelegate.scrollBottom(true);
    })
  }

  addThing() {
    if (this.tmpMessage && this.tmpConId) {
      this.$http.post('http://192.168.1.72:9000/api/messages/conversation/' + this.tmpConId, { message: this.tmpMessage });
      this.tmpMessage='';
    }
  }
}

angular.module('starter')
  .controller('ChatDetailCtrl', ChatDetailCtrl)