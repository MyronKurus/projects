/*
 * Image slide viewer ui
*/

UI.Viewer.ImageSlide = function ( viewer ) {

    this.viewer = viewer;

};

UI.Viewer.ImageSlide.prototype = {};

UI.Viewer.ImageSlide.prototype.init = function () {

    $('#info span').mouseover( this.toggleSlideInfo.bind( this, true ) );
    $('#viewer .detailed-image').mousemove( this.toggleSlideInfo.bind( this, false ) );

};

UI.Viewer.ImageSlide.prototype.generateSlideHTML = function ( node ) {

    var html = '';
    var nodeText;
    var watermark = 0;

    try {

        nodeText = $( node.innerHTML ).text();

    } catch ( e ) {

        nodeText = node.title;

    };

    //

    var infoSpan = '<span>Info...</span>';

    if ( node.title !== '' ) {

        infoSpan = ' | <span>Info...</span>';

    } else {

        infoSpan === '<span>Info...</span>';
    
    }

    html += '<div id="info_text">' + node.innerHTML + '</div>';
    html += '<div id="info" class="color_switch"><span>' + ( nodeText ? node.title + infoSpan : node.title + infoSpan ) + '</span></div>';
    html += '<div class="tmp-image" style="background-image: url(/img/' + localStorage.getItem( 'siteId' ) + '/0/' + node.id + '.jpg?w=100&h=100)"></div>';
    html += '<div class="detailed-image"></div>';

    return html;

};

UI.Viewer.ImageSlide.prototype.toggleSlideInfo = function ( value ) {

    value = ( value !== undefined ) ? value : ( $('#viewer #info_text').attr( 'opened' ) !== 'true' );

    if ( ! $('#viewer #info_text').text() ) return;

    if ( value ) {

        $('#info').fadeOut(300);
        $('#info_text').fadeIn(300);

    } else {

        $('#info').fadeIn(300);
        $('#info_text').fadeOut(300);

    }

    $('#viewer #info_text').attr( 'opened', value );

};

UI.Viewer.ImageSlide.prototype.setEditMode = function ( value ) {

    if ( value ) {
    
        app.ui.leftMenu.open( app.dendoTree.editNode );

    } else {

        app.ui.leftMenu.close();

    }

};

UI.Viewer.ImageSlide.prototype.show = function ( node, fromSlider ) {

    var image = node.image;

    if ( ! fromSlider ) {

        var slide = $( document.createElement('div') );

        slide[0].id = 'viewer-image';
        slide.addClass('slide active viewer-image');

        slide.html( this.generateSlideHTML( node ) );
        $('#viewer').append( slide );

        this.preloadImage( node );

    }

    $('#viewer').css({
        'background-color': 'rgba( 0, 0, 0, 1.0 )',
        'color': 'white'
    });

    //

    this.init();

};

UI.Viewer.ImageSlide.prototype.preloadImage = (function () {

    var image;
    var interval;
    var watermark = 0;

    return function ( node ) {

        var scope = this;

        if ( image ) {

            image.onload = false;
            image.src = false;

        }

        image = new Image();

        image.onload = function () {

            $('#loading-popup').hide();

            $('#viewer .slide.active .detailed-image').css({
                'display': 'block',
                'z-index': 10
            });

            //

            $('#viewer .slide.active .detailed-image').css( 'background-image', 'url(' + this.src + ')' );

            clearInterval( interval );
            interval = setInterval( function () {
            
                if ( ! scope.viewer.animationEnabled ) {

                    resetBackgroundCheck();
                    BackgroundCheck.init({ targets: '.color_switch', images: '#viewer .active.slide .detailed-image' });

                    clearInterval( interval );

                }

            }, 100 );

        };

        image.src = '/img/' + localStorage.getItem( 'siteId' ) + '/' + node.watermarkType + '/' + node.id + '.jpg?w=' + screen.width + '&h=' + screen.height + '&rnd=' + Date.now();

    };

}) ();
