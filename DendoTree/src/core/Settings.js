/*
 * Settings core
*/

var Settings = {};

Settings.get = function ( params, callback ) {

    var siteId = params.siteId;

    connection.query( 'SELECT * FROM tblSites INNER JOIN tblContacts ON tblContacts.conId = tblSites.siteConId WHERE ?', { siteId: siteId }, function ( err, result, fields ) {

        if ( err ) {

            return callback( err );

        }

        if ( ! result.length ) {

            return callback( null, { ok: 0, err: 'Tree "id' + siteId +  '" not found.' });

        }

        result = result[0];

        try {

            result.siteSocialMedia = JSON.parse( result.siteSocialMedia );

        } catch ( err ) {

            result.siteSocialMedia = { fbook: false, twit: false, gplus: false };

        }

        callback( null, {

            // general
            pageTitle:      result.siteTitle || '',
            pageSubTitle:   result.siteSubTitle || '',
            email:          result.siteEmail,
            plan:           result.siteType || 0,
            vstyle:         result.siteTheme || '',
            lang:           result.siteLanguage || '',
            font:           result.siteFont || '',
            background:     result.siteColor || '',
            wstype:         result.siteType || '',
            provider:       result.siteProvider || '',

            // search & sharing
            analytics:  result.siteGaTrackingId || '',
            fbook:      ( result.siteSocialMedia.fbook === 'false' ) ? false : result.siteSocialMedia.fbook,
            twit:       ( result.siteSocialMedia.twit === 'false' ) ? false : result.siteSocialMedia.twit,
            gplus:      ( result.siteSocialMedia.gplus === 'false' ) ? false : result.siteSocialMedia.gplus,

            // your data
            invoice:        result.conInvoiceName || '',
            lastName:       result.conLastName || '',
            prefix:         result.conPrefix || '',
            firstName:      result.conFirstName || '',
            address:        result.conAddressLine1 || '',
            city:           result.conCity || '',
            zipCode:        result.conZipcode || '',
            country:        result.conCountry || '',
            vatNum:         result.conVatNumber || '',
            contactEmail:   result.conEmail || '',
            phone:          result.conPhone || ''

        });

    });

};

Settings.setItem = function ( params, callback ) {

    var siteId = params.siteId;

    var prop = {};
    prop[ params.title ] = params.value;
    var select = {};

    //

    if ( params.table === 'contacts' ) {

        connection.query( 'SELECT siteConId FROM tblSites WHERE ?', { siteId: siteId }, function ( err, result ) {

            if ( err || ! result || ! result.length ) return;

            connection.query( 'UPDATE tblContacts SET ? WHERE ?', [ prop, { conId: result[0].siteConId } ], function ( err, result ) {

                if ( ! callback ) return;

                if ( err ) {

                    return callback( err );

                }

                return callback( null );

            });

        });

    } else {

        connection.query( 'UPDATE tblSites SET ? WHERE ?', [ prop, { siteId: siteId } ], function ( err, result ) {

            if ( ! callback ) return;

            if ( err ) {

                return callback( err );

            }

            return callback( null );

        });

    }

};

module.exports = Settings;
