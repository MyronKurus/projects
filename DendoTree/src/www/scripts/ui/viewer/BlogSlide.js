/*
 * Blog slide viewer ui
*/

UI.Viewer.BlogSlide = function ( viewer ) {

    this.viewer = viewer;

    this.titleUpdateTimeout = false;
    this.contentUpdateTimeout = false;
    this.editImmediately = false;
    
};

UI.Viewer.BlogSlide.prototype = {};

UI.Viewer.BlogSlide.prototype.init = function () {

    this.fileDragHover = this.fileDragHover.bind( this );
    this.fileDragLeave = this.fileDragHover.bind( this );


    $('#viewer .slide.active .image-slot .menu #remove').click( this.removeBlogNodeImage.bind( this ) );
    $('#viewer .slide.active .image-slot .menu #upload').click( this.uploadBlogNodeImage.bind( this ) );

    $('#viewer .slide.active .title').on( 'input', this.titleEdit.bind( this ) );
    $('#viewer .slide.active .title').on( 'keydown', this.titleEditPreventEnter.bind( this ) );
    $('#viewer .slide.active .content').on( 'input', this.contentEdit.bind( this ) );
    
    if ( this.editImmediately ) {

        this.setEditMode( true );

    }

    this.editImmediately = false;

    //

    $.ajax({

        url: '/img/' + localStorage.getItem( 'siteId' ) + '/0/' + app.dendoTree.editNode.id + '.jpg?w=500',

        complete: function ( xhr, textStatus ) {

            if ( xhr.status === 404 ) {

                $('#remove').hide();

            };

        }

    });

};

UI.Viewer.BlogSlide.prototype.generateSlideHTML = function ( node ) {

    var html = '';

    html += '<div class="title-wrapper">';
    html += '   <h3 class="title">' + ( node.title || '' ).replace( /<\/?[^>]+(>|$)/g, '' ) + '</h3>';
    html += '</div>';
    html += '<div class="content-wrapper">';
    html += '   <div class="content">' + ( node.innerHTML || '' ) + '</div>';
    html += '   <div class="image-slot" id="blog-image">';
    html += '       <div class="image-top">Drop Image Here</div>';
    html += '       <div class="progress"></div>';
    html += '       <img class="image" src="' + '/img/' + localStorage.getItem( 'siteId' ) + '/0/' + node.id + '.jpg?w=500"/>';
    html += '       <div class="menu">';
    html += '           <div id="upload">Upload image</div>';
    html += '           <div id="remove">Remove image</div>';
    html += '       </div>';
    html += '</div>';

    return html;

};

UI.Viewer.BlogSlide.prototype.titleEditPreventEnter = function ( event ) {

    if ( event.keyCode === 13 ) {

        return false;

    }

};

UI.Viewer.BlogSlide.prototype.titleEdit = function () {

    var scope = this;
    clearTimeout( this.titleUpdateTimeout );

    $('#viewer-edit .save-label').stop();
    $('#viewer-edit .save-label').html('SAVING CHANGES');
    $('#viewer-edit .save-label').animate( { 'opacity': 0.5 }, 100 );

    app.dendoTree.editNode.title = $('#viewer .slide.active .title').text().replace( /<\/?[^>]+(>|$)/g, '' ).replace( /\n/g, '' );

    this.titleUpdateTimeout = setTimeout( function () {

        app.dendoTree.saveNode( app.dendoTree.editNode, function () {

            $('#viewer-edit .save-label').stop();
            $('#viewer-edit .save-label').html('CHANGES SAVED');
            $('#viewer-edit .save-label').animate( { 'opacity': 1 }, 200 );

            // setTimeout( function () {

            //     $('#viewer-edit .save-label').animate( { 'opacity': 0 }, 600 );

            // }, 2000 );

        });

        app.dendoTree.editNode.generateThumbnail();

    }, 1500 );

};

UI.Viewer.BlogSlide.prototype.contentEdit = function () {

    var scope = this;
    clearTimeout( this.contentUpdateTimeout );

    $('#viewer-edit .save-label').stop();
    $('#viewer-edit .save-label').html('SAVING CHANGES');
    $('#viewer-edit .save-label').animate( { 'opacity': 0.5 }, 100 );

    app.dendoTree.editNode.innerHTML = $('#viewer .slide.active .content').html();

    this.contentUpdateTimeout = setTimeout( function () {

        app.dendoTree.saveNode( app.dendoTree.editNode, function () {
        
            $('#viewer-edit .save-label').stop();
            $('#viewer-edit .save-label').html('CHANGES SAVED');
            $('#viewer-edit .save-label').animate( { 'opacity': 1 }, 200 );

            // setTimeout( function () {

            //     $('#viewer-edit .save-label').animate( { 'opacity': 0 }, 600 );

            // }, 2000 );

        });

        app.dendoTree.editNode.generateThumbnail();

    }, 1500 );

};

UI.Viewer.BlogSlide.prototype.uploadBlogNodeImage = function () {

    var input = document.createElement('input');
    input.type = 'file';

    $( input ).click();
    $( input ).change( function ( event ) {

        Utils.Uploader.loadImage( event.target.files[ 0 ], { imageType: 2 }, function ( image ) {

            $('#viewer .slide.active .image-slot .image')[0].src = image.src;
            $('#viewer .slide.active .image-slot .image').css( 'opacity', 0.5 );

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

                app.dendoTree.editNode.generateThumbnail();

            }

        });

    });

};

UI.Viewer.BlogSlide.prototype.removeBlogNodeImage = function () {

    app.services.removeImage({
        email: localStorage.getItem('email'),
        hash: localStorage.getItem('hash'),
        siteId: localStorage.getItem('siteId'),
        id: app.dendoTree.editNode.id
    }, function () {

        var src = '/img/' + localStorage.getItem( 'siteId' ) + '/0/' + app.dendoTree.editNode.id + '.jpg?w=500"/>';
        $('.image').attr( 'src', src );

        app.dendoTree.editNode.generateThumbnail();

    });

};

UI.Viewer.BlogSlide.prototype.setEditMode = function ( value ) {

    if ( value ) {

        if ( $('#viewer #viewer-blog.active .content-wrapper')[0] ) {

            for ( instance in CKEDITOR.instances ) {

                CKEDITOR.instances[ instance ].destroy();

            }

            $('#viewer #viewer-blog.active .content-wrapper').attr( 'editing', 'true' );
            $('#viewer #viewer-blog.active h3').attr( 'contenteditable', 'true' );
            $('#viewer #viewer-blog.active h3').addClass('edit');
            $('#viewer #viewer-blog.active .content').addClass('edit');
            $('#viewer #viewer-blog.active .image-slot').addClass('edit');
            $($('#viewer #viewer-blog.active .content')[0]).attr( 'contenteditable', 'true' );
            CKEDITOR.inline( $('#viewer #viewer-blog.active .content')[0] );
            $('#viewer-edit').addClass('editing');
            $('#viewer-edit span').addClass('pencil--green');

            // image downloading
            var target = document.getElementById( 'blog-image' );

            target.addEventListener( 'drop', this.fileSelectHandler.bind( this ), true );
            $('#viewer .slide.active')[0].addEventListener( 'dragover', this.fileDragHover, true );
            $('#viewer .slide.active')[0].addEventListener( 'dragleave', this.fileDragLeave, true );

        }

    } else {

        $('#viewer #viewer-blog.active .content-wrapper').attr( 'editing', 'false' );
        $('#viewer #viewer-blog.active h3').attr( 'contenteditable', 'false' );
        $('#viewer #viewer-blog.active h3').removeClass('edit');
        $('#viewer #viewer-blog.active .content').removeClass('edit');
        $('#viewer #viewer-blog.active .image-slot').removeClass('edit');
        $($('#viewer #viewer-blog.active .content')[0]).attr( 'contenteditable', 'false' );
        $('#viewer-edit').removeClass('editing');
        $('#viewer-edit span').removeClass('pencil--green');
        
        $('#viewer .slide.active')[0].removeEventListener( 'dragover', this.fileDragHover, true );
        $('#viewer .slide.active')[0].removeEventListener( 'dragleave', this.fileDragLeave, true );

        for ( instance in CKEDITOR.instances ) {

            CKEDITOR.instances[ instance ].destroy();

        }

    }

};

UI.Viewer.BlogSlide.prototype.show = function ( node, fromSlider ) {

    if ( ! fromSlider ) {

        var slide = $( document.createElement('div') );

        slide[0].id = 'viewer-blog';
        slide.addClass('slide active viewer-blog');

        slide.html( this.generateSlideHTML( node ) );
        $('#viewer').append( slide );

    }

    //

    $('#viewer').css({
        'background-color': 'rgba(256, 256, 256, 1.0)',
        'color': 'black'
    });

    $('#viewer .color_switch').removeClass('background--dark');
    $('#viewer .color_switch').addClass('background--light');
    $('#loading-popup').hide();

    //

    this.init();

};

UI.Viewer.BlogSlide.prototype.fileDragHover = function ( event ) {

    event.stopPropagation();
    event.preventDefault();
    
    if ( event.type === 'dragover' ) {

        $( event.target ).addClass('hover');
        $('.viewer-blog .content-wrapper .image-slot .image-top').css( 'opacity', 1 );

    } else {

        $( event.target ).removeClass('hover');
        $('.viewer-blog .content-wrapper .image-slot .image-top').css( 'opacity', 0 );

    }

};

UI.Viewer.BlogSlide.prototype.fileSelectHandler = function ( event ) {

    var scope = this;
    event.preventDefault();

    var files = event.dataTransfer.files
    Utils.Uploader.loadImage( files[ 0 ], { imageType: 1 }, function ( image ) {

        $('#viewer .slide.active .image-slot .image')[0].src = image.src;
        $('#viewer .slide.active .image-slot .image').css( 'opacity', 0.5 );
        $('.viewer-blog .content-wrapper .image-slot .image-top').css( 'opacity', 0 );

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

    $('#remove').show();

};
