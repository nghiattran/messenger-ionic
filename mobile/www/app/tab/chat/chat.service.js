'use strict';

angular.module('starter')
.factory('chat', function(socket, Auth, $http) {
  var conversations = {};
  var messages = {};

  $http.get('http://192.168.1.72:9000/api/conversations').then(response => {
    conversations = response.data;
  });

  function addChat (tmpConId, cb1, cb2) {
    $http.get('http://192.168.1.72:9000/api/conversations/' + tmpConId).then(response => {
      messages[tmpConId] = response.data;
      var conversations = _.find(conversations, {_id: tmpConId});
      console.log({_id: tmpConId});
      if (conversation) {
        socket.syncAddOnly('message:' + myId, messages[tmpConId], (item) => {
          conversation.lastMessage = item.message;
          cb2();
        });
      };

      cb1();
    });
  }

  
  return {
    conversations: conversations,
    messages: messages,
    addChat: addChat
  }
})