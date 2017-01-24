/*
 * Settings api router
*/

var crypto = require('crypto');

var get = function ( req, res ) {

    var params = {};

    params.email = req.query.email;
    params.hash = req.query.hash;
    params.siteId = req.query.siteId;

    //

    api.user.checksid( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        if ( result.ok === 0 ) {

            return res.send( result );

        }

        api.settings.get( params, function ( err, data ) {

            if ( err ) {

                return res.send( err );

            }

            return res.send( data );

        });

    });

};

var setGeneral = function ( req, res ) {

    var params = {};

    params.email = req.body.email;
    params.hash = req.body.hash;
    params.siteId = req.body.siteId;

    params.title = req.body.pageTitle;
    params.subTitle = req.body.pageSubTitle;
    params.plan = req.body.plan;
    params.vstyle = req.body.vstyle;
    params.lang = req.body.lang;
    params.font = req.body.font;
    params.background = req.body.background;
    params.wstype = req.body.wstype;
    params.provider = req.body.provider;

    //

    switch ( params.background ) {

        case 'Black':

            params.background = '000';
            break;

        case 'White':

            params.background = 'fff';
            break;

    }

    api.user.checksid( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        if ( result.ok === 0 ) {

            return res.send( result );

        }

        api.settings.setItem({ title: 'siteTitle', value: params.title, table: 'site', siteId: params.siteId });
        api.settings.setItem({ title: 'siteSubTitle', value: params.subTitle, table: 'site', siteId: params.siteId });
        api.settings.setItem({ title: 'siteTheme', value: params.vstyle, table: 'site', siteId: params.siteId });
        api.settings.setItem({ title: 'siteLanguage', value: params.lang, table: 'site', siteId: params.siteId });
        api.settings.setItem({ title: 'siteType', value: params.plan, table: 'site', siteId: params.siteId });
        api.settings.setItem({ title: 'siteProvider', value: params.provider, table: 'site', siteId: params.siteId });
        api.settings.setItem({ title: 'siteColor', value: params.background, table: 'site', siteId: params.siteId });
        api.settings.setItem({ title: 'siteFont', value: params.font, table: 'site', siteId: params.siteId });

        //

        return res.send('ok');

    });

};

var setCustomization = function ( req, res ) {

    var params = {};

    params.email = req.body.email;
    params.hash = req.body.hash;
    params.siteId = req.body.siteId;

    // todo

    res.send('ok');

};

var setSearchAndSharing = function ( req, res ) {

    var params = {};

    params.email = req.body.email;
    params.hash = req.body.hash;
    params.siteId = req.body.siteId;

    params.analytics = req.body.analytics,
    params.fbook = req.body.fbook;
    params.twit = req.body.twit;
    params.gplus = req.body.gplus;

    //

    api.user.checksid( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        if ( result.ok === 0 ) {

            return res.send( result );

        }

        api.settings.setItem({ title: 'siteSocialMedia', value: JSON.stringify({ fbook: params.fbook, twit: params.twit, gplus: params.gplus }), table: 'site', siteId: params.siteId });
        api.settings.setItem({ title: 'siteGaTrackingId', value: params.analytics, table: 'site', siteId: params.siteId });

        //

        return res.send('ok');

    });

};

var setYourData = function ( req, res ) {

    var params = {};

    params.email = req.body.email;
    params.hash = req.body.hash;
    params.siteId = req.body.siteId;

    params.contactEmail = req.body.contactEmail;
    params.invoice = req.body.invoice;
    params.lastName = req.body.lastName;
    params.prefix = req.body.prefix;
    params.firstName = req.body.firstName;
    params.address = req.body.address;
    params.city = req.body.city;
    params.zipCode = req.body.zipCode;
    params.country = req.body.country;
    params.vatNum = req.body.vatNum;
    params.email = req.body.email;
    params.phone = req.body.phone;

    //

    api.user.checksid( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        if ( result.ok === 0 ) {

            return res.send( result );

        }

        api.settings.setItem({ title: 'conInvoiceName', value: params.invoice, table: 'contacts', siteId: params.siteId });
        api.settings.setItem({ title: 'conLastName', value: params.lastName, table: 'contacts', siteId: params.siteId });
        api.settings.setItem({ title: 'conPrefix', value: params.prefix, table: 'contacts', siteId: params.siteId });
        api.settings.setItem({ title: 'conFirstName', value: params.firstName, table: 'contacts', siteId: params.siteId });
        api.settings.setItem({ title: 'conAddressLine1', value: params.address, table: 'contacts', siteId: params.siteId });
        api.settings.setItem({ title: 'conCity', value: params.city, table: 'contacts', siteId: params.siteId });
        api.settings.setItem({ title: 'conZipcode', value: params.zipCode, table: 'contacts', siteId: params.siteId });
        api.settings.setItem({ title: 'conCountry', value: params.country, table: 'contacts', siteId: params.siteId });
        api.settings.setItem({ title: 'conVatNumber', value: params.vatNum, table: 'contacts', siteId: params.siteId });
        api.settings.setItem({ title: 'conEmail', value: params.contactEmail, table: 'contacts', siteId: params.siteId });
        api.settings.setItem({ title: 'conPhone', value: params.phone, table: 'contacts', siteId: params.siteId });

        //

        return res.send('ok');

    });

};

var setPassword = function ( req, res ) {

    var params = {};

    params.email = req.body.email;
    params.hash = req.body.hash;
    params.siteId = req.body.siteId;

    params.newHash = crypto.createHash('md5').update( req.body.newPassword ).digest('hex');

    //

    api.user.checksid( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        if ( result.ok === 0 ) {

            return res.send( result );

        }

        api.settings.setItem({ title: 'sitePassword', value: params.newHash, table: 'site', siteId: params.siteId });

        //

        return res.send({ hash: params.newHash });

    });

};

var setEmail = function ( req, res ) {

    var params = {};

    params.email = req.body.email;
    params.hash = req.body.hash;
    params.siteId = req.body.siteId;

    params.newEmail = req.body.newEmail;

    //

    api.user.checksid( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        if ( result.ok === 0 ) {

            return res.send( result );

        }

        api.settings.setItem({ title: 'siteEmail', value: params.newEmail, table: 'site', siteId: params.siteId });

        //

        return res.send('ok');

    });

};

module.exports.get = get;
module.exports.setGeneral = setGeneral;
module.exports.setCustomization = setCustomization;
module.exports.setSearchAndSharing = setSearchAndSharing;
module.exports.setYourData = setYourData;
module.exports.setPassword = setPassword;
module.exports.setEmail = setEmail;
