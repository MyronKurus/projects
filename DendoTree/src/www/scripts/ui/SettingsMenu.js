/*
 * Settings menu js
*/

UI.SettingsMenu = function () {

    this.timeout = false;

    var scope = this;

    $('#leftBarGeneral').click(function () {

        window.history.pushState( null, null, 'general' );

        $('.account h3 span').css( 'opacity', '0');
        $('.engines h3 span').css( 'opacity', '0');
        $('.prof-data h3 span').css( 'opacity', '0');

        $('body').addClass('overflow');

        $('#bd-wrapper').hide();
        $('#set_body').show();
        $('#leftBarGeneral').addClass('selectedLeftBarItem');
        $('#leftBarCustomization').removeClass('selectedLeftBarItem');
        $('#leftBarSearch').removeClass('selectedLeftBarItem');
        $('#leftBarYourData').removeClass('selectedLeftBarItem');

        $('#set_General').show();
        $('#set_Customization').hide();
        $('#set_Search').hide();
        $('#user_Data').hide();

        scope.setValues();

        $('.banner_title h3 span').css( 'opacity', '0' );
        $('.engines h3 span').css( 'opacity', '0');

    });

    $('#leftBarCustomization').click( function () {

        window.history.pushState( null, null, 'customization' );

        $('.account h3 span').css( 'opacity', '0');
        $('.engines h3 span').css( 'opacity', '0');
        $('.prof-data h3 span').css( 'opacity', '0');

        $('body').addClass('overflow');

        $('#bd-wrapper').hide();
        $('#set_body').show();
        $('#leftBarGeneral').removeClass('selectedLeftBarItem');
        $('#leftBarCustomization').addClass('selectedLeftBarItem');
        $('#leftBarSearch').removeClass('selectedLeftBarItem');
        $('#leftBarYourData').removeClass('selectedLeftBarItem');

        $('#set_Customization #banner').addClass('open');
        $('#custom_body').show();

        $('#set_General').hide();
        $('#set_Customization').show();
        $('#set_Search').hide();
        $('#user_Data').hide();

    });

    $('#leftBarSearch').click( function () {

        window.history.pushState( null, null, 'sharing' );

        $('.account h3 span').css( 'opacity', '0');
        $('.engines h3 span').css( 'opacity', '0');
        $('.prof-data h3 span').css( 'opacity', '0');

        $('body').addClass('overflow');

        $('#bd-wrapper').hide();
        $('#set_body').show();
        $('#leftBarGeneral').removeClass('selectedLeftBarItem');
        $('#leftBarCustomization').removeClass('selectedLeftBarItem');
        $('#leftBarSearch').addClass('selectedLeftBarItem');
        $('#leftBarYourData').removeClass('selectedLeftBarItem');

        $('#set_General').hide();
        $('#set_Customization').hide();
        $('#set_Search').show();
        $('#user_Data').hide();

        scope.setValues();

        $('#set_General h3 span').css( 'opacity', '0' );
        $('.engines h3 span').css( 'opacity', '0');

    });

    $('#leftBarYourData').click( function () {

        window.history.pushState( null, null, 'user_data' );

        $('.account h3 span').css( 'opacity', '0');
        $('.engines h3 span').css( 'opacity', '0');
        $('.prof-data h3 span').css( 'opacity', '0');

        $('body').addClass('overflow');

        $('#bd-wrapper').hide();
        $('#set_body').show();
        $('#leftBarGeneral').removeClass('selectedLeftBarItem');
        $('#leftBarCustomization').removeClass('selectedLeftBarItem');
        $('#leftBarSearch').removeClass('selectedLeftBarItem');
        $('#leftBarYourData').addClass('selectedLeftBarItem');

        $('#set_General').hide();
        $('#set_Customization').hide();
        $('#set_Search').hide();
        $('#user_Data').show();

        scope.setValues();

        $('#set_General h3 span').css( 'opacity', '0' );
        $('.banner_title h3 span').css( 'opacity', '0' );

    });

    $('#set_Customization #banner #edit').click( function () {

        $('#set_Customization #banner' ).toggleClass('open');
        $('#set_Customization #banner #edit span').toggleClass('lnr-pencil');
        $('#set_Customization #banner #edit span').toggleClass('lnr-cross');
        $('#custom_body').toggle();

    });

    /*$('#chose_templates').click( function () {
        $('#chose_templates .list_icon span').toggleClass('lnr-chevron-down');
        $('#chose_templates .list_icon span').toggleClass('lnr-chevron-up');
        $('.dropdown').toggle();
        hideOpenDropdowns();
    });*/

    $('#chose_price_plan .price-plan li').click( function () {

        $( $('#chose_price_plan span')[0] ).html( $(this).children('span').html() );
        $('#chose_price_plan .price-plan li').removeClass('selected-item');
        $(this).addClass('selected-item');

    });

    $('#chose_page_font .page-font li').click( function () {

        $( $('#chose_page_font span')[0] ).html( $(this).children('span').html() );
        $('#chose_page_font .page-font li').removeClass('selected-item');
        $(this).addClass('selected-item');

    });

    $('#chose_page_background .page-background li').click( function () {

        $( $('#chose_page_background span')[0] ).html( $(this).children('span').html() );
        $('#chose_page_background .page-background li').removeClass('selected-item');
        $(this).addClass('selected-item');

    });

    $('#chose_your_counry .country-list li').click( function () {

        $( $('#chose_your_counry span')[0] ).html( $(this).children('span').html() );
        $('#chose_your_counry .country-list li').removeClass('selected-item');
        $(this).addClass('selected-item');

    });

    $('#chose_templates li').click( function () {

        $( $('#chose_templates div.template_item')[0] ).attr( 'templatenumber', $( this ).children('div').attr('templatenumber') );
        $( $('#chose_templates span')[0] ).html( $( this ).children('span').html() );
        $( $('#curbanner div.template_item')[0] ).attr( 'templatenumber', $( this ).children('div').attr('templatenumber') );

        scope.setCustomization( true );

        app.dendoTree.homeNodeRepaint();

    });

    $('.networks-list li.c-box').on('click', function () {

        scope.isChecked();
        scope.setSearchData( true );

    });

    /*$('#chose_bg').click( function () {

        $('#chose_bg .list_icon span').toggleClass('lnr-chevron-down');
        $('#chose_bg .list_icon span').toggleClass('lnr-chevron-up');

        $('.bg-dropdown').toggle();
        hideOpenDropdowns();

    });*/

    $('#chose_bg .bg-dropdown li').click( function () {

        $( $('#chose_bg div.bg-icon')[0] ).css( 'background-color', $( this ).children('div.bg-icon').css('background-color') );
        $('#curbanner').css( 'background-color', $( this ).children('div.bg-icon').css('background-color') );             
        $( $('#chose_bg span')[0] ).html( $(this).children('span').html() );
        $('#chose_bg .bg-dropdown li').removeClass('selected-item');
        $(this).addClass('selected-item');
        scope.setCustomization( true );

        app.dendoTree.homeNodeRepaint();

    });

    $('#title_input input').on( 'input', function () {

        $('#curbanner .title').html( $('#title_input input')[0].value );
        $('#title_input .website_title_bottom_label').html( (30 - $('#title_input input')[0].value.length) + ' characters left' );
        scope.setCustomization( false );
        app.dendoTree.homeNodeRepaint();

    });

    $('#subtitle_input input').on( 'input', function () {

        $('#curbanner .subtitle').html( $('#subtitle_input input')[0].value );
        $('#subtitle_input .website_title_bottom_label').html( ( 50 - $('#subtitle_input input')[0].value.length ) + ' characters left' );

        scope.setCustomization( false );
        app.dendoTree.homeNodeRepaint();

    });

    /*$('#chose_title_font').click( function () {

        hideOpenDropdowns();
        $('#chose_title_font .list_icon span').toggleClass('lnr-chevron-down');
        $('#chose_title_font .list_icon span').toggleClass('lnr-chevron-up');

        $('#chose_title_font .font-dropdown').toggle();

    });*/

    $('#chose_title_font li').click( function () {

        $( $('#chose_title_font span')[0] ).css( 'font-family', $(this).children('span').css('font-family') );
        $( $('#chose_title_font span')[0] ).html( $( this ).children('span').html() );
        $('#curbanner .title').css('font-family', $( this ).children('span').css('font-family') );
        $('#chose_title_font li').removeClass('selected-item');
        $(this).addClass('selected-item');

        scope.setCustomization( true );
        app.dendoTree.homeNodeRepaint();

    });

    /*$('#chose_subtitle_font').click( function () {

        $('#chose_subtitle_font .list_icon span').toggleClass('lnr-chevron-down');
        $('#chose_subtitle_font .list_icon span').toggleClass('lnr-chevron-up');
        $('#chose_subtitle_font .font-dropdown').toggle();

    });*/

    $('#chose_subtitle_font li').click( function () {

        $( $('#chose_subtitle_font span')[0] ).css( 'font-family', $(this).children('span').css('font-family') );
        $( $('#chose_subtitle_font span')[0] ).html( $( this ).children('span').html() );
        $('#curbanner .subtitle').css('font-family', $( this ).children('span').css('font-family') );
        $('#chose_subtitle_font li').removeClass('selected-item');
        $(this).addClass('selected-item');

        scope.setCustomization( true );
        app.dendoTree.homeNodeRepaint();

    });

    $('#chose_templates .bg-dropdown li').click( function () {

        $('#chose_templates li').removeClass('selected-item');
        $(this).addClass('selected-item');

    });

    $('#chose_bg .bg-dropdown li').click( function () {

        $('#chose_templates li').removeClass('selected-item');
        $(this).addClass('selected-item');

    });

    $('#title_bold').click( function () {

        $('#title_bold').toggleClass('bold_pressed');

        if ( $('#title_bold').hasClass('bold_pressed') ) {

            $('#curbanner .title').css('font-weight', 'bold' );

        } else {

            $('#curbanner .title').css('font-weight', 'normal' );

        }

        scope.setCustomization( true );
        app.dendoTree.homeNodeRepaint();

    });

    $('#subtitle_bold').click( function () {

        $('#subtitle_bold').toggleClass('bold_pressed');

        if ( $('#subtitle_bold').hasClass('bold_pressed') ) {

            $('#curbanner .subtitle').css('font-weight', 'bold' );

        } else {

            $('#curbanner .subtitle').css('font-weight', 'normal' );

        }

        scope.setCustomization( true );
        app.dendoTree.homeNodeRepaint();

    });

    $( document ).on( 'click', function () {

        var el = $('.wrapper-dropdown');

        if ( el.hasClass('open') ) {

            hideOpenDropdowns();
            $(this).removeClass('open');

        }

    });

    $('.wrapper-dropdown').on( 'click', function ( event ) {

        event.stopPropagation();
        var el = $(this);

        var parent = el.closest('div:has(> ul)');
        var list = parent.children('.dropdown-trigger');
        var height = list.css('height');
        var totalHeight = parseInt( height ) + 48;

        if (  ( parent.offset().top - $(window).scrollTop() ) < ( $(window).height() - totalHeight ) )  {

            list.css( 'top', '48px' );

            if( el.hasClass('open')) {

                hideOpenDropdowns();
                $(this).removeClass('open');

            } else {

                hideOpenDropdowns();
                $(this).addClass('open');

            }

        } else {

            list.css( 'top', '-' + height );

            if( el.hasClass('open')) {

                hideOpenDropdowns();
                $(this).removeClass('open');

            } else {

                hideOpenDropdowns();
                $(this).addClass('open');

            }

        }

    });

    $('#chose_your_counry .lnr-chevron-down').on( 'click', function () {

        $('#chose_your_counry .country-list li.selected-item').attr('id', 'selected-item');

        setTimeout( function () {

            $('#selected-item').get(0).scrollIntoView();

        }, 500 );

    });

    // $('.wrapper-dropdown').on('click', function(){
    //     var el = $(this);
    //     if(el.hasClass('open')) {

    //         hideOpenDropdowns();
    //         $(this).removeClass('open');
    //     } else {

    //         hideOpenDropdowns();
    //         $(this).addClass('open');
    //     }
    // });

    function hideOpenDropdowns () {

        var openDropdowns = $('.wrapper-dropdown.open');
        openDropdowns.removeClass('open');

    };

    /*$('#title_size').click( function () {

        $('#title_size .size-dropdown').toggle();
        hideOpenDropdowns();

    });*/

    $('#title_size .size-dropdown li').click( function () {

        $( $('#title_size li.active')[0] ).toggleClass('active');
        $( this ).toggleClass('active');
        $('#curbanner .title').css('font-size', + $( this ).children('span').text() );

        app.dendoTree.homeNodeRepaint();

    });

    /*$('#subtitle_size').click( function () {

        $('#subtitle_size .size-dropdown').toggle();
        hideOpenDropdowns();

    });*/

    $('#subtitle_size .size-dropdown li').click( function () {

        $( $('#subtitle_size li.active')[0] ).toggleClass('active');
        $( this ).toggleClass('active');
        $('#curbanner .subtitle').css('font-size', + $( this ).children('span').text() );

        app.dendoTree.homeNodeRepaint();

    });

    $('#title_color .title_colorpicker').colorPicker({

        opacity: false,
        renderCallback: function ( $elm, toggled ) {

            if ( $elm.context.className === 'title_colorpicker' ) {

                $('#curbanner .title').css({ color: '#' + this.color.colors.HEX });

            } else if ( $elm.context.className === 'subtitle_colorpicker' ) {

                $('#curbanner .subtitle').css({ color: '#' + this.color.colors.HEX });

            }

            app.dendoTree.homeNodeRepaint();

        }

    });

    $('#title_color').click( function ( event ) {

        if ( event.target.className !== 'title_colorpicker' )  {

            hideOpenDropdowns();
            $('#title_color .title_colorpicker').click();

        }

    });

    $('#subtitle_color .subtitle_colorpicker').colorPicker();
    $('#subtitle_color').click( function ( event ) {

        if ( event.target.className !== 'subtitle_colorpicker' )  {

            hideOpenDropdowns();

            $('#subtitle_color .subtitle_colorpicker').click();

        }

    });

    $('#settings').click( function () {

        $('#set_leftBar').addClass('opened');
        $('.leftBarItem').removeClass('selectedLeftBarItem');

    });

    $('#leftBarClose').click( function () {

        $('body').removeClass('overflow');

        $('#set_leftBar').removeClass('opened');
        $('.leftBarItem').removeClass('selectedLeftBarItem');

        window.history.pushState( null, null, './' );

        $('#set_body').hide();
        $('#bd-wrapper').show();

    });

    // Settings handlers

    $('.email-btn').click( function () {
        
        scope.setEmailData( $('#set-email').val() );

    });

    $('.pass-btn').click( function () {

        scope.setPasswordData( $('#set-pass').val() );

    });

    $('.general-settings .header-list input').on( 'input', function () {

        scope.setGeneralSettings( false );

    });

    $('#set_General .homepage li input').on( 'change', function () {

        scope.setGeneralSettings( true );

    });

    $('#set_General .price li div ul li').on( 'click', function () {

        scope.setGeneralSettings( true );

    });

    $('#set_General .homepage li div ul li').on( 'click', function () {

        scope.setGeneralSettings( true );

    });

    // $('#set_Search li input').on( 'input', function () {

    //     scope.setSearchData( false );

    // });

    $('#set_Search li .twitt, #set_Search li .fb, #set_Search li .googlePlus').on( 'click', function () {

        if ( ! this.checked ) $( this ).parent().parent().find('input[type="text"]').val('');
        scope.setSearchData( true );

    });

    $('#user_Data .data-list .prefix, #user_Data .data-list .address').on( 'input', function () {

        scope.setUserData( false );

    });

    $('#user_Data #chose_your_counry .country-list li').on( 'click', function () {

        scope.setUserData( true );

    });

    // Validation 'General' tab

    $('#set-email').keyup( function () {

        var validMail = $('#set-email').val();

        if ( validMail !== 0 ) {

            if ( isValidEmailAddress( validMail ) ) {

                $('.email-btn').addClass('valid-data');

            } else {

                $('.email-btn').removeClass('valid-data');

            }

        }

    });

    $('#set-pass').keyup( function () {

        var validPass = $('#set-pass').val();

        if ( validPass !== 0 ) {

            if ( isValidPassword( validPass ) ) {

                $('.pass-btn').addClass('valid-data');

            } else {

                $('.pass-btn').removeClass('valid-data');

            }

        }

    });

    // Validation 'Search & Sharing' tab

    $('.facebook .fbook').on( 'input', function () {

        var validFbook = $('.facebook .fbook').val();

        if ( validFbook !== 0 ) {

            if ( isValidFacebook( validFbook ) ) {

                $('.facebook .input-error').css('opacity', '0');
                scope.setSearchData( false );

            } else {

                $('.facebook .input-error').css('opacity', '1');

            }

        }

    });

    $('.twitter .twit').on( 'input', function () {

        var validTwit = $('.twitter .twit').val();

        if ( validTwit !== 0 ) {

            if ( isValidTwitter( validTwit ) ) {

                $('.twitter .input-error').css('opacity', '0');
                scope.setSearchData( false );

            } else {

                $('.twitter .input-error').css('opacity', '1');

            }

        }

    });

    $('.g-plus .gplus').on( 'input', function () {

        var validGplus = $('.g-plus .gplus').val();

        if ( validGplus !== 0 ) {

            if ( isValidGooglePlus( validGplus ) ) {

                $('.g-plus .input-error').css('opacity', '0');
                scope.setSearchData( false );

            } else {

                $('.g-plus .input-error').css('opacity', '1');

            }

        }

    });

    // Validation 'Your Data' tab

    $('.data-list .invoice-name').on( 'input', function () {

        var validInvoice = $('.data-list .invoice-name').val();

        if ( validInvoice !== 0 ) {

            if ( isValidZipCode( validInvoice ) ) {

                $('.invoice .data-input-error').css('opacity', '0');
                scope.setUserData( false );

            } else {

                $('.invoice .data-input-error').css('opacity', '1');

            }

        }

    });

    $('.data-list .last-name').on( 'input', function () {

        var validLastName = $('.data-list .last-name').val();

        if ( validLastName !== 0 ) {

            if ( isValidName( validLastName ) ) {

                $('.l-name .data-input-error').css('opacity', '0');
                scope.setUserData( false );

            } else {

                $('.l-name .data-input-error').css('opacity', '1');

            }

        }

    });

    $('.data-list .first-name').on( 'input', function () {

        var validName = $('.data-list .first-name').val();

        if ( validName !== 0 ) {

            if ( isValidName( validName ) ) {

                $('.f-name .data-input-error').css('opacity', '0');
                scope.setUserData( false );

            } else {

                $('.f-name .data-input-error').css('opacity', '1');

            }

        }

    });

    $('.data-list .city').on( 'input', function () {

        var validCityName = $('.data-list .city').val();

        if ( validCityName !== 0 ) {

            if ( isValidName( validCityName ) ) {

                $('.city-li .data-input-error').css('opacity', '0');
                scope.setUserData( false );

            } else {

                $('.city-li .data-input-error').css('opacity', '1');

            }

        }

    });

    $('.data-list .zip-code').on( 'input', function () {

        var validZip = $('.data-list .zip-code').val();

        if ( validZip !== 0 ) {

            if ( isValidZipCode( validZip ) ) {

                $('.z-code .tiny-data-input-error').css('opacity', '0');
                scope.setUserData( false );

            } else {

                $('.z-code .tiny-data-input-error').css('opacity', '1');

            }

        }

    });

    $('.data-list .vat-num').on( 'input', function () {

        var validVat = $('.data-list .vat-num').val();

        if ( validVat !== 0 ) {

            if ( isValidZipCode( validVat ) ) {

                $('.vatNumb .mid-data-input-error').css('opacity', '0');
                scope.setUserData( false );

            } else {

                $('.vatNumb .mid-data-input-error').css('opacity', '1');

            }

        }

    });

    $('.data-list .e-mail').on( 'input', function () {

        var validMail = $('.data-list .e-mail').val();

        if ( validMail !== 0 ) {

            if ( isValidEmailAddress( validMail ) ) {

                $('.mail-addr .data-input-error').css('opacity', '0');
                scope.setUserData( false );

            } else {

                $('.mail-addr .data-input-error').css('opacity', '1');

            }

        }

    });

    $('.data-list .phone').on( 'input', function () {

        var validPhone = $('.data-list .phone').val();

        if ( validPhone !== 0 ) {

            if ( isValidPhoneNumber( validPhone ) ) {

                $('.telephone .mid-data-input-error').css('opacity', '0');
                scope.setUserData( false );

            } else {

                $('.telephone .mid-data-input-error').css('opacity', '1');

            }

        }

    });


    // Regular expressions

    function isValidEmailAddress ( emailAddress ) {

        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        return pattern.test( emailAddress );

    };

    function isValidPassword ( userPass ) {

        var pattern = new RegExp(/[A-Za-z0-9]{8,20}$/);
        return pattern.test( userPass );

    };

    function isValidFacebook ( facebook ) {

        var pattern = new RegExp(/facebook\.com/);
        return pattern.test( facebook );

    }

    function isValidTwitter ( twitter ) {

        var pattern = new RegExp(/twitter\.com/);
        return pattern.test( twitter );

    }

    function isValidGooglePlus ( googlePlus ) {

        var pattern = new RegExp(/plus\.google\.com/);
        return pattern.test( googlePlus );

    }

    function isValidName ( name ) {

        var pattern = new RegExp(/^[a-zA-Z'][a-zA-Z-' ]+[a-zA-Z']?$/);
        return pattern.test( name );

    }

    function isValidZipCode ( zipCode ) {

        var pattern = new RegExp(/^[a-zA-Z0-9\-]+$/);
        return pattern.test( zipCode );

    } 

    function isValidPhoneNumber ( phoneNumber ) {

        var pattern = new RegExp(/^\+[0-9\- ]*$/);
        return pattern.test( phoneNumber );

    }        

};

UI.SettingsMenu.prototype = {};

UI.SettingsMenu.prototype.setValues = function () {

    app.services.getSettings( {}, function ( data ) {

        $('#settings-wrapper input').prop( 'checked', false );

        $('#set-email').val( data.email );
        $('#set-pass').val( data.password );

        //

        $('#general_title').val( data.pageTitle );
        $('#general_subTitle').val( data.pageSubTitle );

        //

        var pricePlan;

        switch ( data.plan ) {

            case 0:

                pricePlan = 'Premium - 19 euro/month';
                break;

            case 1:

                pricePlan = 'Typical - 12 euro/month';
                break;

            default:

                pricePlan = 'Base - 6 euro/month';

        }

        $('#chose_price_plan>span').html( pricePlan );

        //

        switch ( + data.vstyle ) {

            case 0:

                $('#c-option').prop( 'checked', true );
                break;

            case 1:

                $('#s-option').prop( 'checked', true );
                break;

        }

        //

        switch ( data.lang ) {

            case 'en':

                $('#e-option').prop( 'checked', true );
                break;

            case 'nl':

                $('#n-option').prop( 'checked', true );
                break;

        }

        //

        $('#chose_page_font>span').html( data.font );

        switch ( data.background ) {

            case '000':

                data.background = 'Black';
                break;

            case 'fff':

                data.background = 'White';
                break;

        }

        $('#chose_price_plan .price-plan li:nth-child(' + ( data.plan + 1 ) +')').addClass('selected-item');
        $('#chose_page_font .page-font li[sid="' + data.font.toLowerCase() + '"]').addClass('selected-item');

        $('#chose_page_background>span').html( data.background );
        $('#chose_page_background .page-background li[sid="' + data.background.toLowerCase() + '"]').addClass('selected-item');

        //

        switch ( + data.wstype ) {

            case 0:

                $('#cl-option').prop( 'checked', true );
                break;

            case 1:

                $('#pr-option').prop( 'checked', true );
                break;

            case 2:

                $('#prof-option').prop( 'checked', true );
                break;

        }

        //

        switch ( + data.provider ) {

            case 0:

                $('#t-option').prop( 'checked', true );
                break;

            case 1:

                $('#fol-option').prop( 'checked', true );
                break;

        }

        //

        $('.g-analytics').val( data.analytics );

        setTimeout( function () {

            if ( data.fbook || data.fbook === '') {

                $('.fb').prop( 'checked', true );
                $('.fbook').css('display', 'block');
                $('.fbook').val( data.fbook || '' );

            } else {

                $('.fb').prop( 'checked', false );
                $('.fbook').css('display', 'none');
                $('.fbook').val('');

            }

            if ( data.twit || data.twit === '') {

                $('.twitt').prop( 'checked', true );
                $('.twit').css('display', 'block');
                $('.twit').val( data.twit || '' );

            } else {

                $('.twitt').prop( 'checked', false );
                $('.twit').css('display', 'none');
                $('.twit').val('');

            }

            if ( data.gplus || data.gplus === '' ) {

                $('.googlePlus').prop( 'checked', true );
                $('.gplus').css('display', 'block');
                $('.gplus').val( data.gplus || '' );

            } else {

                $('.googlePlus').prop( 'checked', false );
                $('.gplus').css('display', 'none');
                $('.gplus').val('');

            }

        }, 100 );

        //

        $('.invoice-name').val( data.invoice );
        $('.last-name').val( data.lastName );
        $('.prefix').val( data.prefix );
        $('.first-name').val( data.firstName );
        $('.address').val( data.address );
        $('.city').val( data.city );
        $('.zip-code').val( data.zipCode );
        $('#chose_your_counry>span').html( data.country );

        var countrySpan = $('#chose_your_counry .country-list li span');
        var countryItem = $('#chose_your_counry .country-list li');

        for ( var i = 0; i < $('#chose_your_counry .country-list li').length; i++ ) {

            $( countryItem[ i ] ).attr( 'sid', $( countrySpan[ i ] ).html().toLowerCase().replace( / /ig, '_' ) );

        }

        $( '#chose_your_counry .country-list li[sid="' + data.country.toLowerCase().replace( / /ig, '_' ) + '"]' ).addClass('selected-item');
        $('.vat-num').val( data.vatNum );
        $('.e-mail').val( data.contactEmail );
        $('.phone').val( data.phone );

    });

};

UI.SettingsMenu.prototype.setEmailData = function ( value ) {

    app.services.setEmail({

        email: value

    }, function () {

        $('#set_General h3 span').html('SAVING CHANGES');
        $('#set_General h3 span').animate( { 'opacity': 0.5 }, 100 );

        setTimeout( function () {

            $('#set_General h3 span').html('CHANGES SAVED');
            $('#set_General h3 span').animate( { 'opacity': 1 }, 200 );

            localStorage.setItem( 'email', value );

            // setTimeout( function () {

            //     $('.account h3 span').animate( { 'opacity': 0 }, 600 );

            // }, 2000 );

        }, 2500 )

    });

};

UI.SettingsMenu.prototype.setPasswordData = function ( value ) {

    app.services.setPassword({
        newPassword: value
    }, function ( data ) {

        $('#set_General h3 span').html('SAVING CHANGES');
        $('#set_General h3 span').animate( { 'opacity': 0.5 }, 100 );

        setTimeout( function () {

            $('#set_General h3 span').html('CHANGES SAVED');
            $('#set_General h3 span').animate( { 'opacity': 1 }, 200 );

            localStorage.setItem( 'hash', data.hash );

            // setTimeout( function () {

            //     $('.account h3 span').animate( { 'opacity': 0 }, 600 );

            // }, 2000 );

        }, 2500 )

    });

};

UI.SettingsMenu.prototype.setGeneralSettings = function ( immediate ) {

    var offset = ( immediate === true ) ? 1 : 1000;

    var pricePlan;

    switch ( $('#chose_price_plan>span').html() ) {

        case 'Premium - 19 euro/month':

            pricePlan = 0;
            break;

        case 'Typical - 12 euro/month':

            pricePlan = 1;
            break;

        default:
            pricePlan = 2;

    }

    clearTimeout( this.timeout );

    this.timeout = setTimeout( function () {

        app.services.setGeneral({

            pageTitle: $('#general_title').val(),
            pageSubTitle: $('#general_subTitle').val(),
            plan: pricePlan,
            vstyle: $('input[name="v-style"]:checked').attr('rid'),
            lang: $('input[name="lang"]:checked').attr('rid'),
            font: $('#chose_page_font>span').html(),
            background: $('#chose_page_background>span').html(),
            wstype: $('input[name="ws-type"]:checked').attr('rid'),
            provider: $('input[name="provider"]:checked').attr('rid')

        }, function () {

            $('#set_General h3 span').html('SAVING CHANGES');
            $('#set_General h3 span').animate( { 'opacity': 0.5 }, 100 );

            setTimeout( function () {

                $('#set_General h3 span').html('CHANGES SAVED');
                $('#set_General h3 span').animate( { 'opacity': 1 }, 200 );

                // setTimeout( function () {

                //     $('.account h3 span').animate( { 'opacity': 0 }, 600 );

                // }, 2000 );

            }, 2500 )

        });

    }, offset );

};

UI.SettingsMenu.prototype.setCustomization = function ( immediate ) {

    var offset = ( immediate === true ) ? 1 : 2000;

    clearTimeout( this.timeout );

    this.timeout = setTimeout( function ( ) {

        app.services.setCustomization({

            templateType: $('#chose_templates>span').html(),
            templateBackground: $('#chose_bg>span').html(),
            wsTitle: $('#ws_title').html().replace( / /ig, '_' ),
            titleFont: $('#chose_title_font>span').html().replace( / /ig, '_' ),
            wsSubTitle: $('#ws_subTitle').html().replace( / /ig, '_' ),
            subTitleFont: $('#chose_subtitle_font>span').html().replace( / /ig, '_' )
        }, function () {

            $('.banner_title h3 span').html('SAVING CHANGES');
            $('.banner_title h3 span').animate( { 'opacity': 0.5 }, 100 );

            setTimeout( function () {

                $('.banner_title h3 span').html('CHANGES SAVED');
                $('.banner_title h3 span').animate( { 'opacity': 1 }, 200 );

            }, 2500 )

        });

    }, offset);

};

UI.SettingsMenu.prototype.setSearchData = function ( immediate ) {

    var offset = ( immediate === true ) ? 1 : 2000;

    var fbook = ( ! $('.fb').is(':checked') ) ? false : $('.fbook').val();
    var twit = ( ! $('.twitt').is(':checked') ) ? false : $('.twit').val();
    var gplus = ( ! $('.googlePlus').is(':checked') ) ? false : $('.gplus').val();

    clearTimeout( this.timeout );
    this.timeout = setTimeout( function ( ) {

        app.services.setSearchAndSharing({

            analytics: $('.g-analytics').val(),
            fbook: fbook,
            twit: twit,
            gplus: gplus

        }, function () {

            $('.engines h3 span').html('SAVING CHANGES');
            $('.engines h3 span').animate( { 'opacity': 0.5 }, 100 );

            setTimeout( function () {

                $('.engines h3 span').html('CHANGES SAVED');
                $('.engines h3 span').animate( { 'opacity': 1 }, 200 );

                // setTimeout( function () {

                //     $('.engines h3 span').animate( { 'opacity': 0 }, 600 );

                // }, 2000 );

            }, 2500 )

        });

    }, offset);

};

UI.SettingsMenu.prototype.setUserData = function ( immediate ) {

    var offset = ( immediate === true ) ? 1 : 1000;

    clearTimeout( this.timeout );
    this.timeout = setTimeout( function ( ) {

        app.services.setYourData({

            invoice: $('.invoice-name').val(),
            lastName: $('.last-name').val(),
            prefix: $('.prefix').val(),
            firstName: $('.first-name').val(),
            address: $('.address').val(),
            city: $('.city').val(),
            zipCode: $('.zip-code').val(),
            country: $('#chose_your_counry>span').html(),
            vatNum: $('.vat-num').val(),
            email: $('.e-mail').val(),
            phone: $('.phone').val()

        }, function () {

            $('.prof-data h3 span').html('SAVING CHANGES');
            $('.prof-data h3 span').animate( { 'opacity': 0.5 }, 100 );

            setTimeout( function () {

                $('.prof-data h3 span').html('CHANGES SAVED');
                $('.prof-data h3 span').animate( { 'opacity': 1 }, 200 );

                // setTimeout( function () {

                //     $('.prof-data h3 span').animate( { 'opacity': 0 }, 600 );

                // }, 2000 );

            }, 2500 )

        });

    }, offset);

};

UI.SettingsMenu.prototype.isChecked = function () {

    if ( $('.fb').is(':checked') ) {

        $('.fbook').css('display', 'block');

    } else {

        $('.fbook').css('display', 'none');

    }

    if ( $('.twitt').is(':checked') ) {

        $('.twit').css('display', 'block');

    } else {

        $('.twit').css('display', 'none');

    }

    if ( $('.googlePlus').is(':checked') ) {

        $('.gplus').css('display', 'block');

    } else {

        $('.gplus').css('display', 'none');

    }

};
