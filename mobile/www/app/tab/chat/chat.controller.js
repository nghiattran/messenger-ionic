class ChatCtrl {
  constructor($http, $state, Auth, Chats, FriendService) {
    this.$http = $http;
    this.$state = $state;
    this.Chats = Chats;
    this.FriendService = FriendService;
    
    Auth.myId()
      .then(id=> {
        this.myId = id;
        this.init();
      })
  }

  init() {
    this.Chats.getConversations().then((conversations) =>{
      this.conversations = conversations;
      console.log(conversations);
    })

    this.FriendService.getFriends(friends => {
      this.friends = friends;
    })
  }

  toConversation(userId) {
    this.Chats.getConversations()
      .then(conversations => {
        var conversation = this.findUserConversation(userId, conversations);
        if (conversation) {
          this.$state.go('tab.chat-detail', {chatId: conversation._id});
        } else {
         this.Chats.createConversation(userId)
            .then(res => {
              return this.Chats.getConversations(true).then((conversations) => {
                console.log(conversations);
                this.conversations = conversations;
                return res;
              })
            })
            .then(res => {
              this.$state.go('tab.chat-detail', {chatId: res._id});
            })
        }
      })
  }

  findUserConversation(userId, conversations) {
    for (var x = 0; x < conversations.length; x++) {
      for (var y = 0; y < conversations[x].people.length; y++) {
        if (conversations[x].people[y].userId === userId) {
          return conversations[x];
        }
      };
    };

    return undefined;
  }
}

angular.module('starter')
  .controller('ChatCtrl', ChatCtrl)