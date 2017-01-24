/*
 * Image uploader module
*/

var formidable  = require('formidable');
var util        = require('util');
var fs          = require('fs-extra');
// var qt          = require('quickthumb');
var gm          = require('gm').subClass({ imageMagick: true });

//

var Uploader = {
    newLocation:    './data/'
};

Uploader.upload = function ( req, callback ) {

    /* Location where we want to copy the uploaded file */
    var new_location = Uploader.newLocation;

    var form = new formidable.IncomingForm();
    var formFields = {};
    form.maxFieldsSize = 1024 * 1024 * 10;

    form.parse( req, function ( err, fields, files ) {});

    form.on( 'field', function ( field, value ) {

        formFields[ field ] = value;

    });

    form.on('progress', function ( bytesReceived, bytesExpected ) {

        // console.log( bytesReceived / bytesExpected );

    });

    form.on('error', function ( err ) {

        console.log( err );

    });

    form.on('end', function ( fields, files ) {

        var scope = this;

        var params = {};

        params.email = formFields.email;
        params.hash = formFields.hash;
        params.siteId = formFields.siteId;
        params.imageType = formFields.imageType;

        api.user.checksid( params, function ( err, result ) {

            if ( err ) {

                return callback( err );

            }

            if ( result.ok === 0 ) {

                return callback( result.err );

            }

            /* Temporary location of our uploaded file */
            var temp_path = ( scope.openedFiles[0] ) ? scope.openedFiles[0].path : false;
            /* The file name of the uploaded file */
            var file_name = formFields.nodeId;

            //

            var binaryData = new Buffer( formFields.file.split(';base64,')[1], 'base64' ).toString( 'binary' );

            if ( params.imageType == 1 ) {

                require('fs').writeFile( new_location + params.siteId + '/' + file_name + '.jpg', binaryData, "binary", function ( err ) {

                    gm( new_location + params.siteId + '/' + file_name + '.jpg' )
                    .size(function ( err, size ) {

                        if ( ! err ) {

                            if ( size.width > size.height ) {

                                var scale = size.width / 100;

                                gm( new_location + params.siteId + '/' + file_name + '.jpg' )
                                .resize( 100, size.height / scale, '!' )
                                .write( new_location + params.siteId + '/' + file_name + '-t.jpg', function ( err ) {

                                    return callback( null, { width: size.width, height: size.height } );

                                });

                            } else {

                                var scale = size.height / 100;

                                gm( new_location + params.siteId + '/' + file_name + '.jpg' )
                                .resize( size.width / scale, 100, '!' )
                                .write( new_location + params.siteId + '/' + file_name + '-t.jpg', function ( err ) {

                                    return callback( null, { width: size.width, height: size.height } );

                                });

                            }

                        };
                    });

                });

            } else if ( params.imageType == 2 ) {

                require("fs").writeFile( new_location + params.siteId + '/' + file_name + '.jpg', binaryData, "binary", function ( err ) {

                    return callback( null, {} );

                });

            } else if ( params.imageType == 3 ) {

                require("fs").writeFile( new_location + params.siteId + '/' + file_name + '-t.jpg', binaryData, "binary", function ( err ) {

                    return callback( null, {} );

                });

            }

            //

        });

    });

};

Uploader.get = function ( id, siteId, w, h, response, callback ) {

    function getFile ( name ) {

        var reading = false;
        var readStream = fs.createReadStream( name );

        if ( name === './www/img/empty.jpg' ) {

            response.status( 404 );

        }

        readStream.on( 'error', function ( err ) {

            if ( err && err.errno ) {

                if ( err.errno === 34 || err.errno === -2 ) {

                    getFile( './www/img/empty.jpg' );
                    return;

                } else {

                    return callback( err );

                }

            }

        });

        readStream.on( 'readable', function () {

            if ( reading ) return;
            reading = true;

            //

            gm( readStream ).size( { bufferStream: true }, function ( err, size ) {

                if ( err ) {

                    fs.createReadStream( name ).pipe( response );
                    return;

                }

                if ( Math.max( size.width, size.height ) < Math.max( w, h ) ) {

                    this.stream().pipe( response );
                    return;

                }

                var width = 0;
                var height = 0;

                if ( size.width > size.height ) {

                    width = w;
                    height = w * ( size.height / size.width );

                } else {

                    height = h;
                    width = h * ( size.width / size.height );

                }

                this.resize( width, height, '!' ).stream().pipe( response, function ( err ) {

                    callback( err );

                });

            });

        });

    };

    getFile( Uploader.newLocation + siteId + '/' + id );

};

Uploader.removeImage = function ( id, siteId ) {

    try {

        fs.unlinkSync( Uploader.newLocation + siteId + '/' + id + '.jpg' );

    } catch ( err ) {

    }

    try {

        fs.unlinkSync( Uploader.newLocation + siteId + '/' + id + '-t.jpg' );

    } catch ( err ) {

    }

};

module.exports = Uploader;
