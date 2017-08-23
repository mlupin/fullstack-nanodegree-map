/* global ko, google, $, alert */
/* global infowindow, contentString */
/* exported init, error */
/* global infowindow:true */
/* global contentString:true */

// global variables
var map;

// create variable used for foursquare api calls
var clientID;
var clientSecret;

// List of locations similar to udacity course repo
// Added different locations for LA, address, and categories
// Use gps-coordinates to get exact lat and lng
var initialLocations = [
  {
    title: 'Bay Cities Italian Deli',
    location: {lat: 34.017985, lng: -118.489202}
  },
  {
    title: 'Los Angeles County Museum of Art',
    location: { lat: 34.063791, lng: -118.358885}
  },
  {
    title: 'Museum of Neon Art',
    location: { lat: 34.143754, lng: -118.25466}
  },
  {
    title: 'The Broad',
    location: { lat: 34.054466, lng: -118.250557}
  },
  {
    title: 'Gracias Madre',
    location: { lat: 34.080813, lng: -118.387003 }
  },
  {
    title: 'KazuNori',
    location: { lat: 34.0477, lng: -118.247882 }
  },
  {
    title: 'Getty Center',
    location: { lat: 34.07645, lng: -118.473884 }
  },
  {
    title: 'Salt & Straw',
    location: { lat: 33.990864, lng: -118.465991 }
  },
  {
    title: 'Baldwin Hills Scenic Overlook',
    location: { lat: 34.017583, lng: -118.384038 }
  },
  {
    title: 'Harvelle\'s Blues Club',
    location: { lat: 34.015605, lng: -118.494488 }
  }
];

// location model
var Location = function(data) {

  this.title = ko.observable(data.title);
  this.location = ko.observable(data.location);

  // KO: The visible binding causes the associated DOM element to become hidden
  // or visible according to the value you pass to the binding.
  // set default to visible
  // http://knockoutjs.com/documentation/visible-binding.html
  this.visible = ko.observable(true);

  // create marker with default blue marker
  this.marker = new google.maps.Marker({
      position: {lat: data.location.lat, lng: data.location.lng},
      map: map,
      title: data.title,
      animation: google.maps.Animation.DROP,
      icon: 'images/blue-marker.png'
  });

  // clicking on the marker opens the info window
  this.marker.addListener('click', function() {
    // track visited markers with purple icon
    this.icon = 'images/purple-marker.png';
    // open info window and populate
    InfoWindow(this);
    // setCenter takes a LatLng object to center map
    map.setCenter(this.getPosition()); 
  });

  // note: setVisible keep reference of the marker on the map
  this.displayMarker = ko.computed(function() {
      this.marker.setVisible(this.visible());
  }, this);

  // selecting location from list; similar to clicking on marker
  this.selectLocation = (function() {
    // if marker is not visible, set marker visible by default
    this.visible(true);
    google.maps.event.trigger(this.marker, 'click');
  });
};

// initialize Google Maps
function Map() {
  // Create a styles array to use with the map.
  // Source: https://snazzymaps.com/style/83/muted-blue
  var styles = [{"featureType":"all","stylers":[{"saturation":0},{"hue":"#e7ecf0"}]},{"featureType":"road","stylers":[{"saturation":-70}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"visibility":"simplified"},{"saturation":-60}]}];  

  // Constructor creates a new map
  // Same constructor used in Udacity repo listed in README
  // Changed center location and updated styles listed above
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.032235, lng: -118.348711},
    zoom: 11,
    styles: styles,
    mapTypeControl: false
  });

  // initialize infoWindow
  infowindow = new google.maps.InfoWindow();
  console.log("map initialized");
}

// Info Window function
function InfoWindow(marker) {
  /* Foursquare API OAuth tokens or credentials */
  clientID = "3BL03YSDZLK1BFBXW2KI1LWDOVOKVZOXLI5HTB3ZIFJXSIHJ";
  clientSecret = "QFZIAMU2NPABZRMA2BKRZIXLS0XTBMKDYRRXOOWMMUGWNYD0";

  // get response using OAuth token
  var foursquareURL = 'https://api.foursquare.com/v2/venues/search' +
                   '?client_id=' + clientID +
                   '&client_secret=' + clientSecret + 
                   '&v=20170801' +
                   '&ll=' + marker.position.lat() + ',' + marker.position.lng();
  
  // Source: Sitepoint - Using $.ajax() Tutorial
  $.ajax({
    url: foursquareURL,
    dataType: "json", 
    success: function(data){
      // get venue
      var venue = data.response.venues[0];

      // get formatted phone
      // if phone is undefined, set to error message
      var phone = venue.contact.formattedPhone;
      if (!phone) {
        phone = 'Phone info not available';
      }
      
      // get address and format
      var street = venue.location.formattedAddress[0];
      var city = venue.location.formattedAddress[1];
      var address = '';
      
      // if fields are undefined, set to error message
      if (street || city ) {
        address = street + ', ' + city;
      } else {
        address = "Address not available";
      }

      // social shares
      var fb =  venue.contact.facebook;
      var tw =  venue.contact.twitter;
      
      // use id to retrieve url
      // if url is not available, set link to #
      var url = "https://foursquare.com/v/" + venue.id;
      if (!venue.id) {
        url = "#";
      }
      
      // Source: Google Maps API - Info Window
      contentString = '<div id="content">'+
        '<h4 id="firstHeading" class="firstHeading">'+
        '<a target="_blank" href="' + url + '">' + marker.title + '  </a>'+
        '<a  target="_blank" href="https://facebook.com/'+ fb +
        '" class="social"><i class="fa fa-facebook"></i>  </a>'+
        '<a  target="_blank" href="https://twitter.com/'+ tw +
        '" class="social"><i class="fa fa-twitter"></i>  </a></h4>' +
        '<p>'+ address + '</p>' +
        '<p>'+ phone + '</p>' +
        '</div>';


      console.log("contentString created");
      infowindow.setContent(contentString);
    },
    error: function () {
      alert("Failed to connect to Foursquare.");
    }
  });

  // Open the infowindow on the correct marker
  infowindow.open(map, marker);
  
  // add marker animation
  marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
      marker.setAnimation(null);
    }, 1500);
}

// Source: cat-clicker udacity course
function ViewModel() {
  // self always maps to the View Model
  var self = this;

  // initialize list
  this.locationList = ko.observableArray([]);

  //add each initial location to the location List observable array
  initialLocations.forEach(function(locationItem) {
    self.locationList.push( new Location(locationItem) );
  });

  // initialize filter 
  this.filter = ko.observable('');

  // clear filter
  // Stack Overflow - Knockout.js: clear selection in select element (modified)
  this.clearFilter = function() {
    this.filter('');
  };
  
  // hide all markers
  this.hideAllMarkers = function() {
    self.locationList().forEach(function(locationItem){
        infowindow.close();
        locationItem.visible(false);
    });
  };

  // show all markers
  this.showAllMarkers = function() {
    self.locationList().forEach(function(locationItem){
        infowindow.close();
        locationItem.visible(true);
    });
  };

  // // clear all markers from map
  this.resetMarkers = function() {
    this.clearFilter();
    self.locationList().forEach(function(locationItem){
        // close window and reset icon
        infowindow.close();
        locationItem.marker.icon = 'images/blue-marker.png';
        locationItem.visible(false);
    });
  };

  // reset map initial set
  this.resetMap = function () {
    map.setCenter({lat: 34.032235, lng: -118.348711});
    map.setZoom(11);
  };

  // search function; see source in README
  // Source: Knock Me Out - Filter Function
  this.filteredLocations = ko.computed( function() {
    // close window in case location is not in search results
    infowindow.close();
    var searchTerm = self.filter().toLowerCase();

    if (searchTerm === '') {
      // return all markers
      this.showAllMarkers();
      return self.locationList();
    } else {
      return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
        var locationTitle = locationItem.title().toLowerCase();
        
        // -1 means "no match found" or false; otherwise true
        var result = (locationTitle.indexOf(searchTerm) !== -1);
        locationItem.visible(result);
        return result;
      });
    }
  }, self);

  // (button) clear all markers from map
  this.clear = function() {
    this.clearFilter();
    this.hideAllMarkers();
    console.log("clear");
  };

  // (button) drop all markers to the map
  this.drop = function() {
    this.clearFilter();
    this.showAllMarkers();
    console.log("drop");
  };

  // (button) reset
  this.reset = function () {
    this.resetMarkers();
    this.showAllMarkers();
    this.resetMap();
    console.log("reset");
  };
}

function init() {
  Map();
  ko.applyBindings(new ViewModel());
}

function error() {
  alert("Google Maps has failed to load.");
}