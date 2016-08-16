'use strict';

angular.module('starter')
.factory('socket', function(socketFactory, Auth) {
    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('http://192.168.1.72:9000/', {
      // Send auth token on connection, you will need to DI the Auth service above
      'query': 'token=' + Auth.getToken(),
      path: '/socket.io-client'
    });

    var socket = socketFactory({ ioSocket });

    return {
      socket,

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates(modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save', function (item) {
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },
      syncLogin(id, array, cb) {
        cb = cb || angular.noop;
        console.log(id + ':login');
        socket.on(id + ':login', function (item) {
          var oldItem = _.find(array, {userId: item._id});
          var index = array.indexOf(oldItem);
          array[index].isOnline = true;
        });

        socket.on(id + ':logout', function (item) {
          var oldItem = _.find(array, {userId: item._id});
          var index = array.indexOf(oldItem);
          array[index].isOnline = false;
        });
      },
      syncAddOnly(modelName, array, cb) {
        cb = cb || angular.noop;
        socket.on(modelName, function (item) {
          console.log(item);
          array.push(item);
          cb(item, array);
        });
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates(modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      },
      unsyncAll() {
        socket.removeAllListeners();
      }
    };
  });