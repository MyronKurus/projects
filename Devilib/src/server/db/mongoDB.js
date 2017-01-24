
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/DeviLib');

var db = mongoose.connection;

db.on( 'error', console.error.bind ( console, 'connection error' ) );
db.once( 'open', function ( callback ) {

    console.log( 'Connection succeeded' )

});

var Schema = mongoose.Schema;

var userSchema = new Schema({

    email: String,
    hash: String,
    salt: String,
    sessions: []

});

global.DB = {};
DB.User  = mongoose.model('User', userSchema);
