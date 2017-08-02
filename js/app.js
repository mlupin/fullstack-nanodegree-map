var map;
// Create a new blank array for all the listing markers.
var markers = [];
// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
var placeMarkers = [];

// List of locations similar to udacity course repo
// Added different locations for LA, address, and categories
// Use gps-coordinates to get exact lat and lng
var locations = [
  {
    title: 'Bay Cities Italian Deli',
    location: {lat: 34.017985, lng: -118.489202},
    address: '1517 Lincoln Blvd, Santa Monica, CA 90401',
    info: 'Local staple known for its signature overstuffed sandwiches, '+
          'Italian deli fare & gourmet groceries.',
    category: ['food', 'store']
  },
  {
    title: 'Los Angeles County Museum of Art',
    location: {lat: 34.063791, lng: -118.358885},
    address: ' 5905 Wilshire Blvd, Los Angeles, CA 90036',
    info: 'Largest art museum in the West inspires creativity and dialogue.',
    category: ['museum', 'food', 'entertainment', 'store', 'restaurant', 'park']
  },
  {
    title: 'Museum of Neon Art',
    location: {lat: 34.143754, lng: -118.25466},
    address: '216 S Brand Blvd, Glendale, CA 91204',
    info: 'The Museum of Neon Art encourages learning, curiosity and ' +
          'expression through the preservation, collection and ' +
          'interpretation of neon, electric and kinetic art.',
    category: ['museum', 'store']
  },
  {
    title: 'The Broad',
    location: {lat: 34.054466, lng: -118.250557},
    address: ' 221 S Grand Ave, Los Angeles, CA 90012',
    info: 'The Broad is a contemporary art museum founded by philanthropists '+
          'Eli and Edythe Broad on Grand Avenue in downtown Los Angeles.',
    category: ['museum', 'store', 'entertainment', 'food']
  },
  {
    title: 'Gracias Madre',
    location: {lat: 34.080813, lng: -118.387003},
    address: '8905 Melrose Ave, West Hollywood, CA 90069',
    info: 'Meatless Mexican fare, all vegan & organic, plus a big tequila & ' +
          'drink menu, in a chic space.',
    category: ['food', 'restaurant']
  },
  {
    title: 'KazuNori',
    location: {lat: 34.0477, lng: -118.247882},
    address: '421 S Main St, Los Angeles, CA 90013',
    info: 'Functional, masculine setting for Japanese temaki (hand rolls) '+
          'from a beloved sushi restaurateur.',
    category: ['food', 'restaurant']
  },
  {
    title: 'Getty Center',
    location: {lat: 34.07645, lng: -118.473884},
    address: '1200 Getty Center Dr, Los Angeles, CA 90049',
    info: 'The Getty is one of the world\'s largest arts organizations.',
    category: ['museum', 'food', 'entertainment', 'store', 'restaurant', 'park']
  },
  {
    title: 'Salt & Straw',
    location: {lat: 33.990864, lng: -118.465991},
    address: '1357 Abbot Kinney Blvd, Venice, CA 90291',
    info: 'Popular ice cream chain out of Oregon known for inventive flavors '+
          '& farm-sourced ingredients.',
    category: ['food', 'store']
  },
  {
    title: 'Baldwin Hills Scenic Overlook',
    location: {lat: 34.017583, lng: -118.384038},
    address: '6300 Hetzler Rd, Culver City, CA 90232',
    info: 'Hilltop park with views of Downtown Los Angeles plus hiking trails '+
          '& history exhibits.',
    category: ['park']
  },
  {
    title: 'Harvelle\'s Blue Club',
    location: {lat: 34.015605, lng: -118.494488},
    address: '1432 4th St, Santa Monica, CA 90401',
    info: 'Historic music club presenting blues, jazz, R&B, hip-hop, spoken '+
          'word, burlesque & more since 1931.',
    category: ['entertainment']
  }
]

function initMap() {
  // Create a styles array to use with the map.
  // Source: https://snazzymaps.com/style/83/muted-blue
  var styles = [{"featureType":"all","stylers":[{"saturation":0},{"hue":"#e7ecf0"}]},{"featureType":"road","stylers":[{"saturation":-70}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"visibility":"simplified"},{"saturation":-60}]}];  

  // Constructor creates a new map
  // Same constructor used in Udacity repo listed in README
  // Changed center location and updated styles listed above
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.032235, lng: -118.348711},
    zoom: 12,
    styles: styles,
    mapTypeControl: false
  });
}

// Source: Google Maps API - Marker Animation
// Used to drop each marker on page at a set interval
function drop() {
  clearMarkers();
  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    addMarkerWithTimeout(position, title, i * 100);
  }
}

// Source: Google Maps API - Marker Animation
// Called to push each marker to markers array
function addMarkerWithTimeout(position, title, timeout) {
  window.setTimeout(function() {
    markers.push(new google.maps.Marker({
      position: position,
      title: title,
      map: map,
      animation: google.maps.Animation.DROP
    }));
  }, timeout);
}

// Source: Google Maps API - Marker Animation
// Used to clear each marker from view when drop function is called
function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

