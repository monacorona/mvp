// pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// creates a user Schema. this will be the basis of how user data is stored in the db
var UserSchema = new Schema({
    username: {type: String, required: true},
    detail: {type: String, required: true},
    visited: {type: Date, required: false},
    plans: {type: Date, required: false},
    todo: {type: String, required: false},
    location: {type: [Number], required: true}, // [Long, Lat]
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// sets the created_at parameter equal to the current time
UserSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// indexes this schema in 2dsphere format
UserSchema.index({location: '2dsphere'});

// exports the UserSchema for use elsewhere. sets the mongoDB collection to be used as: "map-user"
module.exports = mongoose.model('map-user', UserSchema);