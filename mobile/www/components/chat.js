'use strict';

angular.module('starter')
.factory('Chats', function(socket, Auth, $http, $q) {
  var conversations = undefined;
  var messages = {};

  function addChat (tmpConId, myId, cb1, cb2) {
    cb1 = cb1 || function () {};
    cb2 = cb2 || function () {};
    if (!conversations) {
      getConversations().then(() => {
        getConversation(tmpConId, myId, cb1, cb2)
      })
    } else {
      getConversation(tmpConId, myId, cb1, cb2)
    }
  }

  function getConversation (conversationId, myId, cb1, cb2) {
    $http.get('http://192.168.1.72:9000/api/conversations/' + conversationId).then(response => {
      messages[conversationId] = response.data;
      var conversation = _.find(conversations, {_id: parseInt(conversationId)});
      if (conversation) {
        socket.syncAddOnly('message:' + myId, messages[conversationId], (item) => {
          var tmpConversation = _.find(conversations, {_id: parseInt(item.conversationId)});
          tmpConversation.lastMessage = item.message;
          tmpConversation.messageAt = item.createdAt;
          cb2();
        });
      };

      cb1(messages[conversationId]);
    });
  }

  function createConversation(userId) {
    return $http.post('http://192.168.1.72:9000/api/conversations', {userId: userId})
    .then((response) => {
      return response.data;
    });
  }

  function getConversations (isRefresh) {
    if (conversations && !isRefresh) {
      var deferred = $q.defer();
      deferred.resolve(conversations);
      return deferred.promise;
    };

    return $http.get('http://192.168.1.72:9000/api/conversations')
    .then((response) => {
      console.log(response);
      conversations = response.data;
      return conversations;
    });
  }

  
  return {
    getConversations: getConversations,
    createConversation: createConversation,
    messages: messages,
    addChat: addChat
  }
});