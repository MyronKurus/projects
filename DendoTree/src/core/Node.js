/*
 * Node core object
*/

var Node = {};

Node.create = function ( node, callback ) {

    if ( node.type === 'mainpage' || node.type === 'subpage' ) {

        connection.query( 'INSERT INTO tblCats SET ?', { catName: 'NewBranch', catSiteId: node.siteId }, function ( err, result ) {

            if ( err ) {

                return callback( err );

            }

            return callback( null, result.insertId );

        });

    } else {

        if ( node.type === 'blog' ) node.type = 'text';

        connection.query( 'INSERT INTO tblItems SET ?', { itemName: node.title, itemText: node.innerHTML, itemType: node.type }, function ( err, result ) {

            if ( err ) {

                return callback( err );

            }

            return callback( null, result.insertId );

        });

    }

};

Node.update = function ( node, callback ) {

    if ( node.type === 'item' || node.type === 'image' || node.type === 'blog' ) {

        var prop = { itemName: node.title, itemText: node.innerHTML };

        if ( node.order !== undefined ) prop.itemOrder = node.order;
        if ( node.catId !== undefined ) prop.itemCatId = node.catId;
        prop.itemWatermarkType = node.watermarkType;

        connection.query( 'UPDATE tblItems SET ? WHERE ?', [ prop, { itemId: node.id } ], function ( err, result ) {

            if ( err ) {

                return callback( err );

            }

            return callback( null, result.insertId );

        });

    } else if ( node.type === 'cat' || node.type === 'mainpage' || node.type === 'subpage' ) {

        connection.query( 'UPDATE tblCats SET ? WHERE ?', [ { catParent: node.parent, catName: node.title, catOrder: node.order }, { catId: node.id } ], function ( err, result ) {

            if ( err ) {

                return callback( err );

            }

            return callback( null, result.insertId );

        });

    }

};

Node.removeImage = function ( node, callback ) {

    api.uploader.removeImage( node.id, node.siteId );

    callback();

};

Node.remove = function ( node, callback ) {

    var siteId = node.siteId;

    if ( node.type === 'item' || node.type === 'image' || node.type === 'blog' ) {

        // remove image file

        api.uploader.removeImage( node.id, siteId );

        // remove from db

        connection.query( 'DELETE FROM tblItems WHERE ?', { itemId: node.id }, function ( err, result ) {

            if ( err ) {

                return callback( err );

            }

            return callback( null );

        });

    } else {

        connection.query( 'SELECT * FROM tblCats WHERE ?', { catParent: node.id }, function ( err, result ) {

            if ( err ) {

                return callback( err );

            }

            //

            result = result || [];
            var itemsToRemove = result.length;

            for ( var i = 0, il = result.length; i < il; i ++ ) {

                removeCatWithItems( result[ i ].catId, function ( err ) {

                    if ( err ) {

                        return callback( err );

                    }

                    //

                    itemsToRemove --;

                    if ( itemsToRemove === 0 ) {

                        finish();

                    }

                });

            }

            if ( result.length === 0 ) {

                finish();

            }

        });

        //

        function removeCatWithItems ( catId, callback ) {

            connection.query( 'DELETE FROM tblCats WHERE ?', { catId: catId }, function ( err ) {

                if ( err ) {

                    return callback( err );

                }

                //

                connection.query( 'SELECT * FROM tblItems WHERE ?', { itemCatId: catId }, function ( err, result ) {

                    if ( err ) {

                        callback( err );

                    }

                    //

                    result = result || [];

                    for ( var i = 0, il = result.length; i < il; i ++ ) {

                        api.uploader.removeImage( result[ i ].itemId, siteId );

                    }

                    connection.query( 'DELETE FROM tblItems WHERE ?', { itemCatId: catId }, function ( err ) {

                        if ( err ) {

                            return callback( err );

                        }

                        //

                        return callback( null );

                    });

                });

            });

        };

        function finish () {

            removeCatWithItems( node.id, function ( err ) {

                if ( err ) {

                    return callback( err );

                }

                //

                callback( null );

            });

        };

    }

};

module.exports = Node;
