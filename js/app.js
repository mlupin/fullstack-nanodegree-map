// global variables
var map;
// Create a new blank array for all the listing markers.
var markers = [];


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
    title: 'Harvelle\'s Blue Club',
    location: { lat: 34.015605, lng: -118.494488 }
  }
];

// {lat: self.lat, lng: self.lng},
var Location = function(data) {

  this.title = ko.observable(data.title);
  this.location = ko.observable(data.location);
  // KO: The visible binding causes the associated DOM element to become hidden
  // or visible according to the value you pass to the binding.
  // set default to visible
  // http://knockoutjs.com/documentation/visible-binding.html
  this.visible = ko.observable(true);

  this.marker = new google.maps.Marker({
      position: {lat: data.location.lat, lng: data.location.lng},
      map: map,
      title: data.title,
      animation: google.maps.Animation.DROP
      // icon: 'images/marker.png'
  });

  // clicking on the marker opens the info window
  this.marker.addListener('click', function() {
    displayInfoWindow(this);
  });

  // note: setVisible keep reference of the marker on the map
  this.displayMarker = ko.computed(function() {
      this.marker.setVisible(this.visible());
  }, this);

  
  this.selectLocation = (function() {
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
  


  // [ ] create drop function
  // [ ] create make marker in location view
  // [ ] create display and clear location functions w/html button options
  // [ ] create timeout to drop location one at a time

};

function displayInfoWindow(marker) {
    // Open the infowindow on the correct marker
    // Source: Google Maps API - Info Window
    contentString = '<div id="content">'+
              '<h4 id="firstHeading" class="firstHeading">' + marker.title  + '</h4>' +
              '</div>';

    infowindow.setContent(contentString);
    infowindow.open(map, marker);
    
    marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function () {
        marker.setAnimation(null);
      }, 1000);

};

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

  // initialize current location
  this.currentLocation = ko.observable( this.locationList() [0] );

  // initialize filter 
  this.filter = ko.observable('');

  // Search function
  this.filteredLocations = ko.computed( function() {
    var searchTerm = self.filter().toLowerCase();

    if (searchTerm === '') {
      self.locationList().forEach(function(locationItem){
        locationItem.visible(true);
      });
      return self.locationList();
    } else {
      return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
        var locationTitle = locationItem.title().toLowerCase();
        
        // -1 means "no match found" or false
        // otherwise true
        var result = (locationTitle.indexOf(searchTerm) !== -1);
        locationItem.visible(result);
        return result;
      });
    }
  }, self);

};

function init() {
  Map();
  ko.applyBindings(new ViewModel());
};
// [ ] error handling