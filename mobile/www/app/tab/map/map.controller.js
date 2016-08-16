class MapController {
  constructor($cordovaGeolocation, $compile, $ionicLoading, $ionicPopup, $http, FriendService, LocationService) {
    this.$cordovaGeolocation = $cordovaGeolocation;
    this.$compile = $compile;
    this.$ionicLoading = $ionicLoading;
    this.$ionicPopup = $ionicPopup;
    this.$http = $http;
    this.FriendService = FriendService;
    this.LocationService = LocationService;
    this.isLoading = true;
    this.init();
  }

  refresh() {
    this.init();
  }

  nameOnClick(userLocation) {
    this.map.setCenter(userLocation.location);
  }

  init() {
    var options = {timeout: 5000, enableHighAccuracy: false};
    // Get google map with user current location as center
    // If unable to get user location, center Ho Chi Minh
    // TODO: center last time location first
    // Get user current location
    this.$cordovaGeolocation.getCurrentPosition(options).then(position=> {
      this.isLoading = false;
      this.setupMap(position);
    }, (error) =>{
      this.isLoading = false;
      this.$ionicPopup.alert({
        title: 'Could not get location',
        template: 'Please Turn on your GPS and come back.'
      });

      // If no GPS set to Ho Chi Minh
      var position = {
        coords: {
          latitude: 10.762622,
          longitude: 106.660172
        }
      }
      this.setupMap(position);
    });
  }

  setupMap(position) {
    this.userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: this.userLocation,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Use google map
    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay.setMap(this.map);

    // Add friends markers
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.addMarkers();
    });
  }

  addMarkers() {
    var myMarker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.userLocation,
      icon: 'img/resize-map-marker-green.png'
    });

    this.FriendService.getFriendLocations(friendLocations => {
      this.addFriendMarkers(friendLocations);
    })    
  }

  addFriendMarkers(locationList) {
    var infowindow = new google.maps.InfoWindow();
    this.userLocations = [];
    for (var i = 0; i < locationList.length; i++) {
      this.userLocations[i] = new UserLocation(locationList[i]);
      this.addMarker(this.userLocations[i], infowindow);
    };
  }

  /**
   * Add a marker ans listenser for each friend location
   */
  addMarker(userLocation, infowindow) {
    var marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: userLocation.location,
      icon: 'img/resize-map-marker-red.png'
    });

    this.LocationService.geocodeToAddress(userLocation.location, address => {
      userLocation.address = address;
      console.log(userLocation);
    })
    var self = this;

    marker.addListener('click', function(){
      var index;
      console.log(userLocation);
      var nglick = 'Ctrl.infowindowOnclick(' + 
        userLocation.position.lat + ',' + 
        + userLocation.position.lng +
        ')'
      var contentString = '<div id="content">' +
        '<h1 id="firstHeading" class="firstHeading"> ' + userLocation.name +  ' </h1>' +
        '<div id="bodyContent" class="row">' + 
          '<div class="col col-75">' +
            'Location: ' + userLocation.address + 
          '</div>' +
          '<div class="col">' +
            '<a ng-click="' + nglick + '">' +
              '<img src="img/directions.png">' +
            '</a>' +
          '</div>' +
      '</div>'
      contentString = (self.$compile(contentString)(self))[0].innerHTML;
      infowindow.setContent(contentString); 

      infowindow.open(self.map, this);
      // this.userLocation.getDirectionTo(self.directionsService, self.directionsDisplay, self.userLocation);
    });
  }

  infowindowOnclick(lat, lng) {
    console.log(lat, lng);
  }

  // Get direction from src to dest
  getDirectionTo(src, dest) {
    var selectedMode = 'DRIVING';
    this.directionsService.route({
      origin: src, 
      destination: dest,
      travelMode: google.maps.TravelMode[selectedMode]
    }, (response, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        console.log(response);
        this.directionsDisplay.setDirections(response);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });
  }
}

angular.module('starter')
  .controller('MapCtrl', MapController)

class UserLocation {
  constructor(position) {
    this.name = position.name;
    this.position = position;
    this.location = new google.maps.LatLng(position.lat, position.lng);
  }

  getDirectionTo(directionsService, directionsDisplay, aPlace) {
    var selectedMode = 'DRIVING';
    directionsService.route({
      origin: this.location,  
      destination: aPlace,
      travelMode: google.maps.TravelMode[selectedMode]
    }, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });
  }

  getDirectionFom(directionsService, directionsDisplay, aPlace) {
    var selectedMode = 'DRIVING';
    directionsService.route({
      origin: aPlace, 
      destination: this.location,
      travelMode: google.maps.TravelMode[selectedMode]
    }, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });
  }
}