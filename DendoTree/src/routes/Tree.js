/*
 * Tree api router
*/

var create = function ( req, res ) {

    var params = {};

    params.email = req.body.email;
    params.hash = req.body.hash;
    params.siteId = req.body.siteId;

    params.treeData = JSON.parse( req.body.tree );

    //

    api.user.checksid( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        if ( result.ok === 0 ) {

            return res.send( result );

        }

        api.tree.create( params, function ( err, treeId ) {

            if ( err ) {

                return res.send( err );

            }

            return res.send({
                id: treeId
            });

        });

    });

};

var update = function ( req, res ) {

    var params = {};

    params.email = req.body.email;
    params.hash = req.body.hash;
    params.siteId = req.body.siteId;

    params.treeId = req.param.treeId || 0;
    params.treeData = JSON.parse( req.body.tree );

    //

    api.user.checksid( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        if ( result.ok === 0 ) {

            return res.send( result );

        }

        api.tree.update( params, function ( err ) {

            if ( err ) {

                return res.send( err );

            }

            return res.send({ success: 1 });

        });

    });

};

var get = function ( req, res ) {

    var params = {};

    params.siteId = req.query.siteId || 0;

    //

    api.tree.get( params, function ( err, tree ) {

        if ( err ) {

            return res.send( err );

        }

        return res.send({ tree: tree });

    });

};

var updateHome = function ( req, res ) {

    var params = {};

    params.email = req.body.email;
    params.hash = req.body.hash;

    params.siteId = req.body.siteId || 0;
    params.title = req.body.title || '';
    params.subTitle = req.body.subTitle || '';

    //

    api.user.checksid( params, function ( err, result ) {

        if ( err ) {

            return res.send( err );

        }

        if ( result.ok === 0 ) {

            return res.send( result );

        }

        api.tree.updateHome( params, function ( err, treeId ) {

            if ( err ) {

                return res.send( err );

            }

            return res.send({ success: 1 });

        });

    });

};

module.exports.create = create;
module.exports.update = update;
module.exports.get = get;
module.exports.updateHome = updateHome;
