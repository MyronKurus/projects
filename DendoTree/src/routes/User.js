/*
 * User api router
*/

var crypto = require('crypto');

var create = function ( req, res ) {

    var params = {};

    api.user.create( params, function ( err ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( 'ok' );

    });

};

var signin = function ( req, res ) {

    var params = {};

    params.email = req.body.email;
    params.password = crypto.createHash('md5').update( req.body.password ).digest('hex');
    params.siteId = req.body.siteId || 11777;

    api.user.signin( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

//

module.exports.create = create;
module.exports.signin = signin;
