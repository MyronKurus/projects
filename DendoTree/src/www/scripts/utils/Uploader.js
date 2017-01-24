/*
 * Image uploader util
*/

window.Utils = window.Utils || {};

Utils.Uploader = function () {};
Utils.Uploader.prototype = {};

Utils.Uploader.prototype.loadImage = function ( src, params, callback, progress ) {

    //  Prevent any non-image file type from being read.

    if ( ! src.type.match( /image.*/ ) ) {

        console.log( 'The dropped file is not an image: ', src.type );
        return;

    }

    //

    var file = src;
    var reader = new FileReader();
    var scope = this;

    reader.onload = function ( event ) {

        scope.fileOnLoad.call( scope, event, params, callback, progress );

    };

    reader.readAsDataURL( file );

};

Utils.Uploader.prototype.fileOnLoad = function ( event, params, callback, progress ) {

    var tree = app.dendoTree;
    var img = new Image();

    img.onload = function () {

        var cor = Math.max( 3000 / img.width, 2000 / img.height );
        var oc = document.createElement('canvas');
        var octx = oc.getContext('2d');

        oc.width = img.width * Math.min( 1, cor );
        oc.height = img.height * Math.min( 1, cor );
        octx.drawImage( img, 0, 0, oc.width, oc.height );

        var fileImage = oc.toDataURL( 'image/jpeg', 1 );
        oc.remove();

        // uploading image

        var data = new FormData();

        data.append( 'file', fileImage );
        data.append( 'imageType', params.imageType );
        data.append( 'nodeId', tree.editNode.id );
        data.append( 'siteId', localStorage.getItem('siteId') );
        data.append( 'hash', localStorage.getItem('hash') );
        data.append( 'email', localStorage.getItem('email') );

        $.ajax({
            url: HOST + '/api/uploadImage', 
            type: 'POST',
            contentType: false, 
            data: data, 
            processData: false,
            cache: false,
            xhr: function () {

                var myXhr = $.ajaxSettings.xhr();
                if ( myXhr.upload ) {

                    myXhr.upload.addEventListener( 'progress', function ( event ) {

                        if ( progress ) {

                            progress( event.loaded / event.total );

                        }

                    }, false );

                }

                return myXhr;

            }
        }).done( function () {

            tree.saveNode( tree.editNode );

        });

    }

    img.src = event.target.result;

    if ( callback ) {

        callback( img );

    }

};

Utils.Uploader.prototype.fileDragHover = function ( event ) {

    event.stopPropagation();
    event.preventDefault();
    event.target.className = ( event.type == 'dragover' ) ? 'hover' : '';

};

Utils.Uploader.prototype.fileSelectHandler = function ( event ) {

    event.preventDefault();

    var files = event.dataTransfer.files;
    this.loadImage( files[0] );

};

Utils.Uploader = new Utils.Uploader();
