/*
 * App services sys
*/

App.prototype.services = {};

App.prototype.services.getSiteData = function ( siteId, callback ) {

    $.get( HOST + '/api/tree/get?siteId=' + siteId, function ( data ) {

        callback( data );

    });

};

App.prototype.services.saveTree = function ( params, callback ) {

    $.post( HOST + '/api/tree/update', { 
        tree: params.tree,
        hash: localStorage.getItem('hash'),
        email: localStorage.getItem('email'),
        siteId: localStorage.getItem('siteId')
    }, function ( data ) {

        console.log( 'Tree saved' );
        callback();

    });

};

App.prototype.services.saveNode = function ( params, callback ) {

    $.post( HOST + '/api/node/update', { 
        id: params.id,
        type: params.type,
        title: params.title,
        innerHTML: params.innerHTML,
        hash: localStorage.getItem('hash'),
        email: localStorage.getItem('email'),
        siteId: localStorage.getItem('siteId'),
        watermarkType: params.watermarkType
    }, function ( data ) {

        console.log( 'Node saved' );
        callback();

    });

};

App.prototype.services.getSettings = function ( param, callback ) {

    $.get( HOST + '/api/settings/get', { 
        
        email: localStorage.getItem('email'),
        hash: localStorage.getItem('hash'),
        siteId: localStorage.getItem('siteId')
        
    }, function ( data ) {

        callback( data );

    });

};

App.prototype.services.setEmail = function ( param, callback ) {
    
    $.post( HOST + '/api/settings/setEmail', { 

        email:      localStorage.getItem('email'),
        hash:       localStorage.getItem('hash'),
        siteId:     localStorage.getItem('siteId'),
        newEmail:   param.email

    }, function ( data ) {

        callback();

    });

};

App.prototype.services.setPassword = function ( param, callback ) {
    
    $.post( HOST + '/api/settings/setPassword', { 

        email:          localStorage.getItem('email'),
        hash:           localStorage.getItem('hash'),
        siteId:         localStorage.getItem('siteId'),
        newPassword:    param.newPassword

    }, function ( data ) {

        callback( data );

    });

};

App.prototype.services.setGeneral = function ( param, callback ) {
    
    $.post( HOST + '/api/settings/setGeneral', {

        email: localStorage.getItem('email'),
        hash: localStorage.getItem('hash'),
        siteId: localStorage.getItem('siteId'), 
        pageTitle: param.pageTitle,
        pageSubTitle: param.pageSubTitle,
        plan: param.plan,
        vstyle: param.vstyle,
        lang: param.lang,
        font: param.font,
        background: param.background,
        wstype: param.wstype,
        provider: param.provider

    }, function ( data ) {

        callback();

    });

};

App.prototype.services.setCustomization = function ( param, callback ) {

    $.post( HOST + '/api/settings/setCustomization', {
        
        email: localStorage.getItem('email'),
        hash: localStorage.getItem('hash'),
        siteId: localStorage.getItem('siteId'),
        templateType: param.templateType,
        templateBackground: param.templateBackground,
        wsTitle: param.wsTitle,
        titleFont: param.titleFont,
        wsSubTitle: param.wsSubTitle,
        subTitleFont: param.subTitleFont

    }, function ( data ) {

        callback();

    });

};

App.prototype.services.setSearchAndSharing = function ( param, callback ) {
    
    $.post( HOST + '/api/settings/setSearchAndSharing', {

        email: localStorage.getItem('email'),
        hash: localStorage.getItem('hash'),
        siteId: localStorage.getItem('siteId'), 
        analytics: param.analytics,
        fbook: param.fbook,
        twit: param.twit,
        gplus: param.gplus

    }, function ( data ) {

        callback();

    });

};

App.prototype.services.setYourData = function ( param, callback ) {
    
    $.post( HOST + '/api/settings/setYourData', { 

        email: localStorage.getItem('email'),
        hash: localStorage.getItem('hash'),
        siteId: localStorage.getItem('siteId'),
        contactEmail: param.email,
        invoice: param.invoice, 
        lastName: param.lastName,
        prefix: param.prefix,
        firstName: param.firstName,
        address: param.address,
        city: param.city,
        zipCode: param.zipCode,
        country: param.country,
        vatNum: param.vatNum,
        phone: param.phone

    }, function ( data ) {

        callback();

    });

};

App.prototype.services.removeImage = function ( param, callback ) {
    
    $.post( HOST + '/api/node/removeImage', { 
        email: localStorage.getItem('email'),
        hash: localStorage.getItem('hash'),
        siteId: localStorage.getItem('siteId'),
        id: param.id
    }, function ( data ) {

        callback();

    });

};
