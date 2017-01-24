/*
 * Uploader api router
*/

var upload = function ( req, res ) {

    api.uploader.upload( req, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send( result );

    });

};

var get = function ( req, res ) {

    try {
    
        var arr = req.baseUrl.split('/');
        var id = arr.pop().split('?')[0];
        var siteId = arr.pop();
        var width = req.query.w;
        var height = req.query.h;

    } catch ( err ) {

        return res.send({ err: 'Some error occured.' });

    }

    api.uploader.get( id, siteId, width, height, res, function ( err, result ) {

        res.status( 404 );

        if ( err ) {

            return res.send( err );

        }

        if ( result ) {

            res.header( "Content-Type", "image/jpeg" );
            res.status( 200 );
            return res.send( result );

        }

    });

};

module.exports.upload = upload;
module.exports.get = get;
