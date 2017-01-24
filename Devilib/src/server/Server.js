
var express = require( 'express' );
var bodyParser = require( 'body-parser' );

var mongoDB = require( './db/mongoDB' );

var app = express();
var PORT = 10171;

require('./Global');

var obj = {

    name: 'Hello',
    surname: 'World!'

}

app.use( bodyParser() );

app.use( express.static( __dirname + '/../client/') );
app.use( '/*', express.static( __dirname + '/../client/index.html') );

require( './Api' ).setup( app );

app.listen( PORT, function () {

    console.log( 'Yes ' + PORT + ' is working!!!!!!' );

});
