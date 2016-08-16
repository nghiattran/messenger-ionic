'use strict';

angular.module('starter')
  .service('LocationService', function($http, $cordovaGeolocation) {
    var coords;
    var geocoder = new google.maps.Geocoder;

    onDeviceReady();
    function onDeviceReady() {
      var watchOptions = {
        timeout : 3000,
        enableHighAccuracy: false // may cause errors if true
      };

      var watch = $cordovaGeolocation.watchPosition(watchOptions);
      watch.then(
        null,
        function(err) {
          console.log('err', err);
        },
        function(position) {
          coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude        
          }
          var payload = {
            location: coords
          }
          console.log('position');
          $http.post('http://192.168.1.72:9000/api/userlocations', payload)
            .then(response => {
              console.log(response);
            })
        });
    }

    /**
     * Google LatLng object to address string
     */
    function geocodeToAddress (location, cb) {
      geocoder.geocode({'location': location}, (results, status) => {
        cb(formatGGAddress(results))
      })
    }

    /**
     * Google Geocoder returns a set of guesses for user address
     * This function parses the result and return only city, state, and country
     */
    function formatGGAddress(geoResult) {
      var index = -1;
      var location = '';
      // index 0 means the most accurate guess
      for (var i = 0; i < geoResult[0].address_components.length; i++) {
        if (geoResult[0].address_components[i].types.indexOf('locality') !== -1) {
          index = i;
        };

        if (index !== -1 ) {
          if (i === geoResult[0].address_components.length-1) {
             location += geoResult[0].address_components[i].long_name + '.';
          } else {
            location += geoResult[0].address_components[i].long_name + ', ';
          }
        }
      }
      return location;
    }

    return {
      coords: coords,
      geocodeToAddress: geocodeToAddress
    }
  })
