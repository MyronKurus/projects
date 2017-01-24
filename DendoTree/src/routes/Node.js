/*
 * Node api router
*/

var create = function ( req, res ) {

    var params = {};

    params.email = req.body.email;
    params.hash = req.body.hash;
    params.siteId = req.body.siteId;

    params.title = req.body.title || '';
    params.type = req.body.type || 'mainpage';
    params.treeID = req.body.treeID;

    //

    api.user.checksid( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        if ( result.ok === 0 ) {

            return res.send( result );

        }

        api.node.create( params, function ( err, nodeId ) {

            if ( err ) {

                return res.send( err );

            }

            return res.send({
                id: nodeId
            });

        });

    });

};

var update = function ( req, res ) {

    var params = {};

    params.email = req.body.email;
    params.hash = req.body.hash;
    params.siteId = req.body.siteId;

    params.id = req.body.id;
    params.type = req.body.type || 'image';
    params.title = req.body.title || '';
    params.innerHTML = req.body.innerHTML || '';
    params.watermarkType = req.body.watermarkType || 0;

    //

    api.user.checksid( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        if ( result.ok === 0 ) {

            return res.send( result );

        }

        api.node.update( params, function ( err ) {

            if ( err ) {

                return res.send( err );

            }

            return res.send({ success: 1 });

        });

    });

};

var remove = function ( req, res ) {

    var params = {};

    params.email = req.body.email;
    params.hash = req.body.hash;
    params.siteId = req.body.siteId;

    params.id = req.body.id;
    params.type = req.body.type;

    //

    api.user.checksid( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        if ( result.ok === 0 ) {

            return res.send( result );

        }

        api.node.remove( params, function ( err ) {

            if ( err ) {

                return res.send( err );

            }

            return res.send({ success: 1 });

        });

    });

};

var removeImage = function ( req, res ) {

    var params = {};

    params.email = req.body.email;
    params.hash = req.body.hash;
    params.siteId = req.body.siteId;

    params.id = req.body.id;

    //

    api.user.checksid( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        if ( result.ok === 0 ) {

            return res.send( result );

        }

        api.node.removeImage( params, function ( err ) {

            if ( err ) {

                return res.send( err );

            }

            return res.send({ success: 1 });

        });

    });

};

module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;
module.exports.removeImage = removeImage;
