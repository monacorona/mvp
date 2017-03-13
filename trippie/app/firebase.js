var firebase = require("firebase");
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

var FirebaseRef = new Firebase("https://APP-NAME.firebaseio.com/");
// leave out Storage
//require("firebase/storage");

// this is me trying to integrate firebase to my app...and i havent had enough time with it so DONT LAUGH AT ME.

var config = {

// initialize the default app
var defaultApp = firebase.initializeApp(defaultAppConfig);

console.log(defaultApp.name);
defaultStorage = firebase.storage();
defaultDatabase = firebase.database()
};
firebase.initializeApp(config);


