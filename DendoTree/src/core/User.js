/*
 * User core object
*/

var User = {};

User.signin = function ( params, callback ) {

    connection.query( 'SELECT * FROM tblSites WHERE ?', { siteId: params.siteId }, function ( err, result ) {

        if ( err ) {

            return callback( err );

        }

        result = ( result || [] )[0];

        if ( ! result ) {

            return callback( null, { ok: 0, err: 'The username does not exists.', errCode: 1 } );

        }

        if ( result.siteEmail !== params.email ) {

            return callback( null, { ok: 0, err: 'The username does not exists.', errCode: 1 } );

        }

        if ( result.sitePassword !== params.password ) {

            return callback( null, { ok: 0, err: 'Password you entered is incorrect.', errCode: 2 } );

        }

        return callback( null, { ok: 1, email: params.email, hash: params.password });

    });

};

User.checksid = function ( params, callback ) {

    connection.query( 'SELECT * FROM tblSites WHERE ?', { siteId: params.siteId }, function ( err, result ) {

        if ( err ) {

            return callback( err );

        }

        result = ( result || [] )[0];

        if ( ! result ) {

            return callback( null, { ok: 0, err: 'The username does not exists.', errCode: 1 } );

        }

        if ( result.siteEmail !== params.email ) {

            return callback( null, { ok: 0, err: 'The username does not exists.', errCode: 1 } );

        }

        if ( result.sitePassword !== params.hash ) {

            return callback( null, { ok: 0, err: 'Password you entered is incorrect.', errCode: 2 } );

        }

        return callback( null, { ok: 1, email: params.email, hash: params.password });

    });

};

module.exports = User;
