/*
 * setting up server API 
*/

var router = {
    node:       require('./routes/Node'),
    tree:       require('./routes/Tree'),
    uploader:   require('./routes/Uploader'),
    user:       require('./routes/User'),
    settings:   require('./routes/Settings')
};

module.exports.setup = function ( app ) {

    // settings api

    app.get( '/api/settings/get', router.settings.get );
    app.post( '/api/settings/setGeneral', router.settings.setGeneral );
    app.post( '/api/settings/setCustomization', router.settings.setCustomization );
    app.post( '/api/settings/setSearchAndSharing', router.settings.setSearchAndSharing );
    app.post( '/api/settings/setYourData', router.settings.setYourData );
    app.post( '/api/settings/setEmail', router.settings.setEmail );
    app.post( '/api/settings/setPassword', router.settings.setPassword );

    // node api

    app.post( '/api/node/create', router.node.create );
    app.post( '/api/node/update', router.node.update );
    app.post( '/api/node/remove', router.node.remove );
    app.post( '/api/node/removeImage', router.node.removeImage );

    // tree api

    app.post( '/api/tree/update', router.tree.update );
    app.post( '/api/tree/updateHome', router.tree.updateHome );
    app.get( '/api/tree/get', router.tree.get );

    // uploader api

    app.use( '/img/node-images/*', router.uploader.get );
    app.post( '/api/uploadImage', router.uploader.upload );

    // user api

    app.post( '/api/user/create', router.user.create );

    // user api

    app.post( '/api/user/signin', router.user.signin );

    app.get( '/api/restart', function ( req, res ) {

        console.log( 'Shutting down.' );
        res.send( 'Done.' );
        process.exit();

    });

};
