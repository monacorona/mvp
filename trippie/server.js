
// dependencies
// -----------------------------------------------------
var express         = require('express');
var mongoose        = require('mongoose');
var port            = process.env.PORT || 3000;
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var app             = express();

// express Configuration
// -----------------------------------------------------
// sets the connection to MongoDB
mongoose.connect("mongodb://localhost/trippyApp");

//logging and parsing
app.use(express.static(__dirname + '/public'));                 // sets the static files location to public
app.use('/bower_components',  express.static(__dirname + '/bower_components')); // uses bowerComponents
app.use(morgan('dev'));                                         // log with morgan
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(methodOverride());

// routes
// ------------------------------------------------------
require('./app/routes.js')(app);

// listen to dat port
// -------------------------------------------------------
app.listen(port);
console.log('currently listening on port ' + port);