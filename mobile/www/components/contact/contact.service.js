'use strict';

angular.module('starter')
  .service("ContactsService", function($q) {
    var formatContact = function(contact) {
      var displayName;
      try {
        displayName = contact.name.formatted || contact.name.givenName + " " + contact.name.familyName || contact.displayName || "Mystery Person";
      } catch(error) {

      }

      return {
        "displayName": displayName,
        "emails": contact.emails || [],
        "phones": contact.phoneNumbers || [],
        "photos": contact.photos || []
      };
    };

    var formatContacts = function(contacts) {
      var contactList = [];
      console.log(contacts);
      for (var i = 0; i < contacts.length; i++) {
        contactList.push(formatContact(contacts[i]));
      };
      console.log(contactList);
      return contactList;
    };

    var find = function() {
      var deferred = $q.defer();
      if(navigator && navigator.contacts) {
        var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
        navigator.contacts.find(fields, function(contacts){
          deferred.resolve(formatContacts(contacts));
        });
      } else {
        deferred.reject("No contacts in desktop browser");
      }
      return deferred.promise;
    };

    var pickContact = function() {
      var deferred = $q.defer();
      if(navigator && navigator.contacts) {
        navigator.contacts.pickContact(function(contact){
          deferred.resolve( formatContact(contact) );
        });
      } else {
        deferred.reject("No contacts in desktop browser");
      }
      return deferred.promise;
    };

    return {
      pickContact : pickContact,
      find: find
    };
  })