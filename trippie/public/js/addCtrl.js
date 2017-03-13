// creates addCtrl module & controller. note that it depends on the 'geolocation' and 'gservice' modules and controllers.
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){

    // initializes variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var lng = 0;


    // sets initial coordinates to hack reactor
    $scope.formData.latitude = 37.78;
    $scope.formData.longitude = -122.40;

    geolocation.getLocation().then(function(data){

        // sets the latitude and longitude equal to the HTML5 coordinates
        coords = {lat:data.coords.latitude, lng:data.coords.longitude};

        // display coordinates in location textboxes rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.lng).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);


        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    });

    // functions
    // ----------------------------------------------------------------------------
    // gets coordinates based on mouse clicks. when a click event is detected....
    $rootScope.$on("clicked", function(){

        // run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
        });
    });

    // creates a new user based on the form fields
    $scope.createUser = function() {

        // grabs all of the text box fields
        var userData = {
            username: $scope.formData.username,
            detail: $scope.formData.detail,
            visited: $scope.formData.visited,
            plans: $scope.formData.plans,
            todo: $scope.formData.todo,
            location: [$scope.formData.longitude, $scope.formData.latitude],

        };

        // saves the user data to the db
        $http.post('/users', userData)
            .success(function (data) {

                // once complete, pls clear the form (except location)
                $scope.formData.username = "";
                $scope.formData.detail = "";
                $scope.formData.todo = "";
                $scope.formData.visited = "MM/dd/yyyy";
                $scope.formData.plans = "MM/dd/yyyy";

                // refreshes map with new data
                gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
});