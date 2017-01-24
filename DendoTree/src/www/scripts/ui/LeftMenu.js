/*
 * Left menu handling
*/

UI.LeftMenu = function () {

    this.opened = false;

    this.updateTimeout = false;
    this.activeNode = false;

    //

    this.init();

};

UI.LeftMenu.prototype = {};

UI.LeftMenu.prototype.init = function () {

    var scope = this;

    // $(document).keyup(function(e) {

    //     if ( e.keyCode === 27 ) {

    //         this.close.bind( this );

    //     }
    
    // });

    $('#button_save_and_close').click( this.close.bind( this ) );
    $('#node_title').on( 'input', this.titleEdit.bind( this ) );
    $('#editor').on( 'input', this.descriptionEdit.bind( this ) );
    $('#editor').on('focus', function() {

        $('#cke_1_top').hide();
    
    });
       
    //

    var target = document.getElementById( 'drop_image' );
    target.addEventListener( 'dragover', this.fileDragHover.bind( this ), true );
    target.addEventListener( 'dragleave', this.fileDragHover.bind( this ), true );
    target.addEventListener( 'drop',  this.fileSelectHandler.bind( this ), true );

    $('#drop_image .menu #remove-image').click( this.removeBlogNodeImage.bind( this ) );
    $('#drop_image .menu #upload-image').click( this.uploadBlogNodeImage.bind( this ) );

    $('.left_menu-item li').on('click', function ( ) {

        $( $('#chose_left_menu-item span')[0] ).html( $(this).children('span').html() );
        $('.left_menu-item li').removeClass('selected-item');
        $( this ).addClass('selected-item');
        
        app.dendoTree.editNode.watermarkType = + $( this ).attr('sid');

        app.dendoTree.saveNode( app.dendoTree.editNode, function () {

            $('#left-bar .status-wrapper .status').html('Changes saved');
            $('#left-bar .status-wrapper .status').stop();
            $('#left-bar .status-wrapper .status').animate({ opacity: 1 }, 200 );

            $('#viewer .slide.active .detailed-image').css( 'background-image', 'url(' + '/img/' + localStorage.getItem( 'siteId' ) + '/' + app.dendoTree.editNode.watermarkType + '/' + app.dendoTree.editNode.id + '.jpg?w=' + screen.width + '&h=' + screen.height + '&rnd=' + Date.now() + ')' );

            setTimeout( function () {

                $('#left-bar .status-wrapper .status').stop();

            }, 2000 );

        });
        
    });

};

UI.LeftMenu.prototype.open = function ( node ) {

    $('#left-bar').addClass('opened');
    this.opened = true;
    this.activeNode = node;

    $('#left-bar #drop_image').removeClass('filled');

    if ( node ) {

        $('#left-bar #node_title').val( node.title );
        $('#left-bar #title_bottom_label').html( ( 30 - node.title.length ) + ' characters left' );
        $('#left-bar #editor').html( node.innerHTML );
        $('#left-bar #drop_image').addClass('filled');

        $( '#chose_left_menu-item .left_menu-item li[sid="' + node.watermarkType + '"]' ).addClass('selected-item');

        var watermarkText = $('#chose_left_menu-item .left_menu-item li[sid="' + node.watermarkType + '"]>span');

        $('#chose_left_menu-item>span').html( watermarkText.html() );

        if ( node.image ) {
        
            $('#left-bar #drop_image').css( 'background-image', 'url(' + node.image + '?' + Date.now() + ')' );

        }

    }

};

UI.LeftMenu.prototype.close = function () {

    $('#left-bar').removeClass('opened');
    this.opened = false;

};

UI.LeftMenu.prototype.fileDragHover = function ( event ) {

    event.stopPropagation();
    event.preventDefault();
    
    if ( event.type === 'dragover' ) {

        $( event.target ).addClass('hover');
        $('.drop-image-top').css( 'opacity', 1 );

    } else {

        $( event.target ).removeClass('hover');
        $('.drop-image-top').css( 'opacity', 0 );

    }

};

UI.LeftMenu.prototype.fileSelectHandler = function ( event ) {

    var scope = this;
    event.preventDefault();

    var files = event.dataTransfer.files
    Utils.Uploader.loadImage( files[ 0 ], { imageType: 1 }, function ( image ) {

        $('#left-bar #drop_image').css( 'background-image', 'url(' + image.src + ')' );
        $('#left-bar #drop_image').removeClass('hover');
        $('#viewer .slide.active .detailed-image').css( 'background-image', 'url(' + image.src + ')' );
        $('#viewer .slide.active .tmp-image').css( 'background-image', 'url(' + image.src + ')' );

        scope.activeNode.updateImage( { width: image.width, height: image.height }, image.src );

    }, function ( progress ) {

        $('#drop_image .progress').css({
            'opacity': 1,
            'width': 100 * progress + '%'
        });

        if ( progress === 1 ) {

            $('#drop_image .progress').css( 'opacity', 0 );

        }

    });

};

UI.LeftMenu.prototype.titleEdit = function () {

    clearTimeout( this.updateTimeout );

    var title = $('#node_title')[0].value.substring( 0, 30 );

    if ( title === '') {

        $('#viewer .slide.active #info span').html('Info...</span>');
        
    } else {

        $('#viewer .slide.active #info span').html( title + '<span> | Info...</span>');
        
    }

    
    $('#title_bottom_label').html( ( 30 - title.length ) + ' characters left' );

    if ( title.length === 30 ) {

        $('#node_title').val( title );

    }

    app.dendoTree.editNode.title = title;

    $('#left-bar .status-wrapper .status').html('Saving changes');
    $('#left-bar .status-wrapper .status').stop();
    $('#left-bar .status-wrapper .status').animate({ opacity: 0.5 }, 200 );

    this.updateTimeout = setTimeout( function () {

        app.dendoTree.saveNode( app.dendoTree.editNode, function () {

            $('#left-bar .status-wrapper .status').html('Changes saved');
            $('#left-bar .status-wrapper .status').stop();
            $('#left-bar .status-wrapper .status').animate({ opacity: 1 }, 200 );

            setTimeout( function () {

                $('#left-bar .status-wrapper .status').stop();
                // $('#left-bar .status-wrapper .status').animate({ opacity: 0 }, 600 );

            }, 2000 );

        });

    }, 1500 );

};

UI.LeftMenu.prototype.descriptionEdit = function () {

    clearTimeout( this.updateTimeout );

    var description = $('#left-bar #editor').html();
    app.dendoTree.editNode.innerHTML = description;
    $('#viewer .slide.active #info_text').html( description );
    // $('#viewer .slide.active #info span span').remove();

    // if ( $('#left-bar #editor').text() ) {

    //     $('#viewer .slide.active #info span').append('<span> | Info...</span>');

    // }

    //

    $('#left-bar .status-wrapper .status').html('Saving changes');
    $('#left-bar .status-wrapper .status').stop();
    $('#left-bar .status-wrapper .status').animate({ opacity: 0.5 }, 200 );

    this.updateTimeout = setTimeout( function () {

        app.dendoTree.saveNode( app.dendoTree.editNode, function () {

            $('#left-bar .status-wrapper .status').html('Changes saved');
            $('#left-bar .status-wrapper .status').stop();
            $('#left-bar .status-wrapper .status').animate({ opacity: 1 }, 200 );

            // setTimeout( function () {

            //     $('#left-bar .status-wrapper .status').stop();
            //     $('#left-bar .status-wrapper .status').animate({ opacity: 0 }, 600 );

            // }, 2000 );

        });

    }, 1500 );

};

UI.LeftMenu.prototype.setStatus = function ( value, color ) {

    $('#left-bar .status').text( value );
    $('#left-bar .status').css( 'color', color );

};

UI.LeftMenu.prototype.hideStatus = function ( value, color ) {

    $('#left-bar .status').fadeOut( 'slow', function () {

        $('#left-bar .status').text('');
        $('#left-bar .status').show();

    });

};

UI.LeftMenu.prototype.uploadBlogNodeImage = function () {

    var input = document.createElement('input');
    input.type = 'file';

    $( input ).click();
    $( input ).change( function ( event ) {

        Utils.Uploader.loadImage( event.target.files[ 0 ], { imageType: 1 }, function ( image ) {

            $('#left-bar #drop_image').css( 'background-image', 'url(' + image.src + ')' );
            $('#viewer .slide.active .tmp-image').css( 'background-image', 'url(' + image.src + ')' );
            $('#viewer .slide.active .detailed-image').css( 'background-image', 'url(' + image.src + ')' );

        }, function ( progress ) {

            $('#viewer .slide.active .image-slot .progress').css({
                'opacity': 1,
                'width': 100 * progress + '%'
            });

            if ( progress === 1 ) {

                $('#viewer-edit .save-label').css( 'opacity', 1 );
                $('#viewer .slide.active .image-slot .image').css( 'opacity', 1 );
                $('#viewer .slide.active .image-slot .progress').css( 'opacity', 0 );

                setTimeout( function () {

                    $('#viewer-edit .save-label').css( 'opacity', 0 );

                }, 2000 );

            }

        });

    });

};

UI.LeftMenu.prototype.removeBlogNodeImage = function () {

    alert( 'Not implemented yet.' );

};
