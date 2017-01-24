/*
 * Tree core object
*/

var Tree = {};

Tree.create = function ( params, callback ) {

    var content = JSON.stringify( params.treeData );

    connection.query( 'INSERT INTO tblSites SET ?', { siteName: '', siteTitle: params.treeData.meta.title, siteText: params.treeData.meta.subTitle }, function ( err, result ) {

        if ( err ) {

            return callback( err );

        };

        return callback( null, result.insertId );

    });

};

Tree.update = function ( params, callback ) {

    var siteId = params.siteId || 1;
    var tree = params.treeData;

    var nodesToSave = tree.meta.nodesCount - 1;
    var savedNodes = 0;

    for ( var i in tree.content ) {

        var node = tree.content[ i ];
        node.id = + i;
        node.type = 'cat';
        
        api.node.update( node, function () {

            savedNodes ++;

            if ( savedNodes === nodesToSave ) {

                return callback( null, { ok: 1 } );

            }

        });

        node.content = node.content || [];

        for ( var j = 0, jl = node.content.length; j < jl; j ++ ) {

            node.content[ j ].type = 'item';
            node.content[ j ].catId = node.id;
            node.content[ j ].order = j;

            api.node.update( node.content[ j ], function () {

                savedNodes ++;

                if ( savedNodes === nodesToSave ) {

                    return callback( null, { ok: 1 } );

                }

            });

        }

        for ( var j in node.pages ) {

            node.pages[ j ].type = 'cat';
            node.pages[ j ].parent = node.id;
            node.pages[ j ].id = j;

            api.node.update( node.pages[ j ], function () {

                savedNodes ++;

                if ( savedNodes === nodesToSave ) {

                    return callback( null, { ok: 1 } );

                }

            });

            for ( var k = 0, kl = node.pages[ j ].content.length; k < kl; k ++ ) {

                node.pages[ j ].content[ k ].type = 'item';
                node.pages[ j ].content[ k ].catId = j;
                node.pages[ j ].content[ k ].order = k;

                api.node.update( node.pages[ j ].content[ k ], function () {

                    savedNodes ++;

                    if ( savedNodes === nodesToSave ) {

                        return callback( null, { ok: 1 } );

                    }

                });

            }

        }

    }

};

Tree.get = function ( params, callback ) {

    var siteId = params.siteId;

    var tree = {
        meta:       { nodesCount: 1, title: '', subTitle: '', zoom: 0, sliderCoff: 0, sliderTop: 0, imagesParams: [] },
        content:    {}
    };

    var categories = [];
    var nodes = [];

    var allCategories = {};
    var allNodes = {};

    //

    connection.query( 'SELECT * FROM tblSites WHERE ?', { siteId: siteId }, function ( err, result, fields ) {

        if ( err ) {

            return callback( err );

        }

        if ( ! result.length ) {

            return callback( null, { ok: 0, err: 'Tree "id' + siteId +  '" not found.' });

        }

        //

        tree.meta.title = result[0].siteTitle;
        tree.meta.subTitle = result[0].siteDescription;
        tree.meta.zoom = 0.748;
        tree.meta.sliderTop = 141.63;
        tree.meta.sliderCoff = 0.2876;

        //

        connection.query( 'SELECT * FROM tblCats WHERE ? ORDER BY catParent', { catSiteId: siteId }, function ( err, result, fields ) {

            if ( err ) {

                return callback( err );

            }

            //

            categories = result || [];

            var nodesToLoad = categories.length;

            if ( ! categories.length ) {

                return callback( null, tree );

            }

            //

            tree.meta.nodesCount += categories.length;

            for ( var i = 0, il = categories.length; i < il; i ++ ) {

                if ( categories[ i ].catParent === null ) {
                
                    tree.content[ categories[ i ].catId ] = {

                        id:         categories[ i ].catId,
                        content:    [],
                        pages:      {},
                        order:      categories[ i ].catOrder,
                        title:      categories[ i ].catName

                    };

                    allCategories[ categories[ i ].catId ] = tree.content[ categories[ i ].catId ];

                } else {

                    tree.content[ categories[ i ].catParent ].pages[ categories[ i ].catId ] = {

                        id:         categories[ i ].catId,
                        content:    [],
                        pages:      {},
                        order:      categories[ i ].catOrder,
                        title:      categories[ i ].catName

                    };

                    allCategories[ categories[ i ].catId ] = tree.content[ categories[ i ].catParent ].pages[ categories[ i ].catId ];

                }

                //

                connection.query( 'SELECT * FROM tblItems WHERE ? ORDER BY itemOrder', { itemCatId: categories[ i ].catId }, function ( err, result, fields ) {

                    if ( err ) {

                        return callback( err );

                    }

                    //

                    nodes = result;
                    var node;

                    tree.meta.nodesCount += result.length;

                    for ( var j = 0, jl = nodes.length; j < jl; j ++ ) {

                        node = nodes[ j ];

                        if ( node.itemType === 'image' ) {

                            allCategories[ node.itemCatId ].content.push({

                                id:             node.itemId,
                                title:          node.itemName || '',
                                text:           node.itemText || '',
                                watermarkType:  node.itemWatermarkType || 0,
                                type:           'image'

                            });

                        } else {
                        
                            allCategories[ node.itemCatId ].content.push({

                                id:     node.itemId,
                                title:  node.itemName || '',
                                image:  node.itemImage,
                                text:   node.itemText || '',
                                order:  node.order,
                                type:   'blog'

                            });

                        }

                    }

                    nodesToLoad --;

                    if ( nodesToLoad === 0 ) {

                        return callback( null, tree );

                    }

                });

            }

        });

    });

};

Tree.remove = function ( parse, callback ) {

    var siteId = params.siteId || 1;

    connection.query( 'DELETE FROM tblSites WHERE ?', { siteId: siteId }, function ( err, result ) {

        if ( err ) {

            return callback( err );

        }

        //

        connection.query( 'SELECT * FROM tblCats WHERE ?', { catSiteId: siteId }, function ( err, result ) {

            if ( err ) {

                return callback( err );

            }

            //

            result = result || [];

            for ( var i = 0, il = result.length; i < il; i ++ ) {

                removeNodes( result, i );

            }

        });

    });

    //

    function removeNodes ( categories, id ) {

        connection.query( 'DELETE FROM tblItems WHERE ?', { itemCatId: categories[ id ].catId }, function ( err, result ) {

            if ( err ) {

                return callback( err );

            }

            //

            if ( id === categories.length - 1 ) {

                removeCategories();

            }

        });

    };

    function removeCategories () {

        connection.query( 'DELETE FROM tblCats WHERE ?', { siteId: siteId }, function ( err, result ) {

            if ( err ) {

                return callback( err );

            }

            //

            callback();

        });

    };

};

Tree.updateHome = function ( params, callback ) {

    var siteId = params.siteId || 1;

    var prop = {
        siteTitle: params.title,
        siteDescription: params.subTitle
    };

    connection.query( 'UPDATE tblSites SET ? WHERE ?', [ prop, { siteId: siteId } ], function ( err, result ) {

        if ( err ) {

            return callback( err );

        }

        return callback( null, result.insertId );

    });

};

module.exports = Tree;
