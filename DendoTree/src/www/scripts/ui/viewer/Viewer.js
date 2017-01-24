/*
 * Nodes viewer ui
*/

UI.Viewer = function () {

    this.animationEnabled = false;

    this.imageSlide = new UI.Viewer.ImageSlide( this );
    this.blogSlide = new UI.Viewer.BlogSlide( this );

    //

    this.init();

};

UI.Viewer.prototype = {};

UI.Viewer.prototype.init = function () {

    $('#editor').trumbowyg({

        fullscreenable: false,
        btns: [ 'viewHTML', '|', 'formatting', '|', 'btnGrp-design', '|', 'link', '|', 'btnGrp-justify', '|', 'btnGrp-lists', '|', 'horizontalRule' ]

    });

    $('#viewer-close').click( this.close.bind( this ) );
    $('#viewer-edit span').click( this.toggleEditing.bind( this ) );

    $('#prev-arrow').click( this.prev.bind( this ) );
    $('#next-arrow').click( this.next.bind( this ) );

    //

    $( document ).keydown( this.keyHandler.bind( this ) );

};

UI.Viewer.prototype.close = function () {

    var tree = app.dendoTree;

    if ( this.animationEnabled ) return;

    $('.slide').remove();

    $('#bd-wrapper').show();
    $('#viewer').hide();

    tree.editNode.closeNode( tree );
    tree.canvas.deactivateAll();
    app.ui.leftMenu.close();

    $('#viewer-edit span').removeClass('pencil--green');
    $('.save-label').css('opacity', '0');
    $('.status').css('opacity', '0');

    if ( !app.isAuthenticated ) {

        $('#settings').hide();
    
    }

    this.resizeWindow();

};

UI.Viewer.prototype.toggleEditing = function ( force, node ) {

    var value = ( typeof force === 'boolean' ) ? force : ! $('#viewer-edit').hasClass('editing');

    this.blogSlide.setEditMode( value );

    if ( ( node || app.dendoTree.editNode ).nodeType === 'ImageNode' || ! value ) {
    
        this.imageSlide.setEditMode( value );

    }

};

UI.Viewer.prototype.next = function () {

    if ( this.animationEnabled ) return;

    var tree = app.dendoTree;
    var curNode = tree.editNode;
    var direction = 'next';

    $('.save-label').css('opacity', '0');
    $('.status').css('opacity', '0');

    if ( tree.editNode.children[0] ) {

        tree.editNode = tree.editNode.children[0];

    } else {

        var tempNode = tree.editNode;

        while ( tempNode.parent.nodeType === 'ImageNode' || tempNode.parent.nodeType === 'BlogNode' ) {

            tempNode = tempNode.parent;

        }

        tree.editNode = tempNode;

    }

    this.sliderAnimation( curNode, tree.editNode, direction );
    app.ui.leftMenu.close();

};

UI.Viewer.prototype.prev = function () {

    if ( this.animationEnabled ) return;

    var tree = app.dendoTree;
    var curNode = tree.editNode;
    var direction = 'prev';

    $('.save-label').css('opacity', '0');
    $('.status').css('opacity', '0');

    if ( tree.editNode.parent.nodeType === 'ImageNode' ||  tree.editNode.parent.nodeType === 'BlogNode' ) {

        tree.editNode = tree.editNode.parent;

    } else {

        var tempNode = tree.editNode;

        while ( tempNode.children[0] ) {

            tempNode = tempNode.children[0];

        }

        tree.editNode = tempNode;

    }

    this.sliderAnimation( curNode, tree.editNode, direction );
    app.ui.leftMenu.close();

};

UI.Viewer.prototype.keyHandler = function ( event ) {

    var tree = app.dendoTree;

    switch ( event.keyCode ) {

        case 27:    // ESC

            if ( $('input#node_title').is(':focus') || $('div#editor').is(':focus') ) {

                app.ui.leftMenu.close();

            } else if ( $('#viewer').css('display') !== 'none' ) {

                app.ui.leftMenu.close();
                app.ui.viewer.close();

            }

            break;

        case 32:    // SPACE

            if ( this.sliderAnimation ) return;

            if ( document.activeElement && document.activeElement.tagName !== 'BODY' ) break;

            if ( $('#viewer').css('display') !== 'none' && tree.editNode.nodeType === 'ImageNode' && app.ui.leftMenu.opened && tree.editNode.innerHTML ) {

                $('#info').toggle();
                $('#info_text').fadeToggle(300);

            }

            break;

        case 37:    // LEFT ARROW

            event.preventDefault();

            if ( document.activeElement && document.activeElement.tagName !== 'BODY' ) break;

            if ( $('#viewer').css('display') !== 'none' ) {

                this.prev();

            }

            break;

        case 38:    // UP ARROW

            if ( document.activeElement && document.activeElement.tagName !== 'BODY' ) break;

            if ( $('#viewer').css('display') !== 'none' ) {

                this.close();

            }

            break;

        case 39:    // RIGHT ARROW

            event.preventDefault();

            if ( document.activeElement && document.activeElement.tagName !== 'BODY' ) break;

            if ( $('#viewer').css('display') !== 'none' ) {

                this.next();

            }

            break;

        case 40:    // DOWN ARROW

            if ( document.activeElement && document.activeElement.tagName !== 'BODY' ) break;

            if ( $('#viewer').css('display') !== 'none' ) {

                this.close();

            }

            break;

    }

};

UI.Viewer.prototype.sliderAnimation = function ( curNode, nextNode, direction ) {

    var scope = this;

    this.toggleEditing( false, curNode );
    this.animationEnabled = true;

    $('#loading-popup').hide();

    //

    var currentSlide = $('#viewer .active');
    var nextSlide = $( document.createElement('div') );

    $('.viewer-image.active').removeClass('active');
    $('.viewer-blog.active').removeClass('active');

    //

    $('.tmp-image').css({ 'display': 'none', 'background-image': 'none' });

    if ( nextNode.nodeType === 'BlogNode' ) {

        $('#viewer').css( 'background-color', 'rgba(255, 255, 255, 1.0)' );
        nextSlide[0].id = 'viewer-blog';
        nextSlide.addClass('viewer-blog');
        nextSlide.html( this.blogSlide.generateSlideHTML( nextNode ) );

    } else {

        $('#viewer').css( 'background-color', 'rgba(0, 0, 0, 1.0)' );
        nextSlide[0].id = 'viewer-image';
        nextSlide.addClass('viewer-image');
        nextSlide.html( this.imageSlide.generateSlideHTML( nextNode ) );

        this.imageSlide.preloadImage( nextNode );

    }

    nextSlide.addClass('slide active');
    nextSlide.css({
        'transform': 'translateX(' + ( direction === 'next' ? window.innerWidth : - window.innerWidth ) + 'px)'
    });

    nextSlide.find('.tmp-image').show();
    nextSlide.find('.tmp-image').css( 'background-image', 'url(/img/' + localStorage.getItem( 'siteId' ) + '/0/' + nextNode.id + '.jpg?w=100&h=100)' );

    nextSlide.addClass('slide-animate');
    currentSlide.addClass('slide-animate');

    $('#viewer .slide').addClass('old');
    $('#viewer').append( nextSlide );

    setTimeout( function () {

        currentSlide.css( 'transform', 'translateX(' + ( direction == 'next' ? - window.innerWidth : window.innerWidth ) + 'px)' );
        nextSlide.css( 'transform', 'translateX(0px)' );

    }, 50 );

    setTimeout( function () {

        $('#viewer .slide.old').remove();
        $('#loading-popup').show();
        scope.showSlide( nextNode, true );

    }, 1100 );

};

UI.Viewer.prototype.prepareSlideURL = function ( str, maxLength ) {

    var outNext, out = '';

    str = str || '';
    str = str.replace( / /g, '_' ).toLowerCase();
    str = str.replace( /(&nbsp;|(<([^>]+)>))/ig, ' ' ); // Strip HTML
    str = str.match( /\S+/g );
    str = str || '';

    for ( var i = 0, il = str.length; i < il; i ++ ) {

        out += str[ i ];
        outNext = out + str[ i + 1 ];

        if ( outNext.length >= maxLength ) {

            return out;

        }

        out += ' ';

    }

    return out;

};

UI.Viewer.prototype.showSlide = function ( editNode, fromSlider ) {

    var tree = editNode.tree;

    var regSpace = /\s/;
    var nodeTitle = editNode.title;
    var updatedTitle = nodeTitle.replace( regSpace, '_' );

    window.history.pushState( null, null, '/' + editNode.id + '/' + this.prepareSlideURL( updatedTitle, 20 ) );

    //

    tree.canvas.stateful = true;
    tree.editNode = editNode;
    tree.canvas.moveTo( editNode.group, tree.canvas.getObjects().length - 20 );

    //

    if ( editNode.nodeType === 'BlogNode' ) {

        this.blogSlide.show( editNode, fromSlider );

    } else if ( editNode.nodeType === 'ImageNode' ) {

        this.imageSlide.show( editNode, fromSlider );

    }

    $('#image_number').html( editNode.countNumber() );
    $('#viewer').show();

    //

    this.animationEnabled = false;

};

UI.Viewer.prototype.resizeWindow = function () {

    var tree = app.dendoTree;
        
    tree.canvas.deactivateAllWithDispatch();

    var width = window.innerWidth;
    var height = window.innerHeight;

    var deltaX = ( ( tree.nodes[0].group.left - tree.leftMenu.background.width ) / ( tree.canvas.getWidth() - tree.leftMenu.background.width ) * ( width - tree.leftMenu.background.width ) ) - ( tree.nodes[0].group.left  - tree.leftMenu.background.width );

    tree.canvas.setWidth( width );
    tree.canvas.setHeight( height - $('#header').height() );
    tree.canvas.calcOffset();

    tree.moveTree( deltaX, 0, tree );

    $('.canvas-container').css( 'width', width );
    $('.canvas-container').css( 'height', height - $('#header').height() );

    tree.recountNodesWidth( tree.nodes[0], null,  false );    

}
