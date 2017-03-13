// Dependencies
var mongoose        = require('mongoose');
var User            = require('./model.js');


// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // retrieve records for all users in the db
    app.get('/users', function(req, res){

        // uses Mongoose schema to run the search (empty conditions)
        var query = User.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);

            // if no errors are found, it responds with a JSON of all users
            res.json(users);
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // provides method for saving new users in the db
    app.post('/users', function(req, res){

        // creates a new User based on the Mongoose schema and the post bo.dy
        var newuser = new User(req.body);

        // new User is saved in the db.
        newuser.save(function(err){
            if(err)
                res.send(err);

            // if no errors are found, it responds with a JSON of the new user
            res.json(req.body);
        });
    });
};  