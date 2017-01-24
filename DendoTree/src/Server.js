/*
 * Main server file
*/

console.log( 'Starting server...' );

require( __dirname + '/Globals' );

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.use( cookieParser({ limit: '3mb' }) );
app.use( bodyParser.json({limit: '50000mb'}) );
app.use( bodyParser.urlencoded({ limit: '50000mb', extended: false }) );
app.use( express.static( __dirname + '/www') );

//

require('./Api').setup( app );

// static content

app.use( '/login', function ( req, res ) {

    res.sendFile( __dirname + '/www/login.html' );

});

app.use( '*', function ( req, res ) {

    res.sendFile( __dirname + '/www/index.html' );

});

//

app.listen( PORT );

//

console.log( 'Started server on port ' + PORT );
