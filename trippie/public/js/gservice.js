// creates the gservice factory aka the primary means of how to interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){

        // init variables
        // -------------------------------------------------------------
        // service factory
        var googleMapService = {};

        // array of locations obtained from API calls
        var locations = [];

        // variables used to help find the right spot
        var lastMarker;
        var currentSelectedMarker;

        // selected location (initialize to hack reactor address)
        var selectedLat = 37.78;
        var selectedLong = -122.40;

        // handling clicks and location selection
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;

        // functions
        // --------------------------------------------------------------
        // refreshes map with new data and will take new latitude and longitude coordinates.
        googleMapService.refresh = function(latitude, longitude){

            // clears the holding array of locations
            locations = [];

            // sets the selected lat+long to the ones provided on the refresh() call
            selectedLat = latitude;
            selectedLong = longitude;

            // performs AJAX call to get all the records in the db.
            $http.get('/users').success(function(response){

                // Convert the results into Google Map Format
                locations = convertToMapPoints(response);

                // Then initialize the map.
                initialize(latitude, longitude);
            }).error(function(){});
        };

        // private inner function
        // --------------------------------------------------------------
        // converts a JSON string of users into map points
        var convertToMapPoints = function(response){

            // clears the locations holder
            var locations = [];

            // loop through all of the JSON entries provided in the response
            for(var i= 0; i < response.length; i++) {
                var user = response[i];

                // create popup windows for each record
                var  contentString =
                    '<p><b>username</b>: ' + user.username +
                    '<br><b>visited</b>: ' + user.visited +
                    '<br><b>detail</b>: ' + user.detail +
                    '<br><b>plans</b>: ' + user.plans +
                    '</p>';

                // converts each of the JSON records into Google Maps Location format ([lat, lng]] format).
                locations.push({
                    latlon: new google.maps.LatLng(user.location[1], user.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    username: user.username,
                    detail: user.detail,
                    visited: user.visited,
                    plans: user.plans
            });
        }
        // location is now an array populated with records in Google Maps format
        return locations;
    };

// initializes map
var initialize = function(latitude, longitude) {

    // uses the selected lat+long as starting point
    var myLatLng = {lat: selectedLat, lng: selectedLong};

    // if map has not been created...
    if (!map){

        // create new map and place in the index.html page
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: myLatLng
        });
    }

    // loop through each location in the array and place a marker
    locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            title: "Big Map",
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });

        // for each marker created, add a listener that checks for clicks
        google.maps.event.addListener(marker, 'click', function(e){

            // when clicked, open the selected marker's message
            currentSelectedMarker = n;
            n.message.open(map, marker);
        });
    });

    // sets initial location as a bouncing red marker
    var initialLocation = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
    lastMarker = marker;

    // function for moving to a selected location
    map.panTo(new google.maps.LatLng(latitude, longitude));

    // clicking on the map moves the bouncing red marker
    google.maps.event.addListener(map, 'click', function(e){
        var marker = new google.maps.Marker({
            position: e.latLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        // when a new spot is selected, delete the old red bouncing marker
        if(lastMarker){
            lastMarker.setMap(null);
        }

        // creates a new red bouncing marker and moves to it
        lastMarker = marker;
        map.panTo(marker.position);

        // updates broadcasted variable (lets each panel know to change their lat, long values)
        googleMapService.clickLat = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast("clicked");
    });
};

// refresh the page upon window load. use the initial latitude and longitude
google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
});

