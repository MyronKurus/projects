/*
 * Login page js
*/

var HOST = '';

//

function init () {

    localStorage.setItem( 'siteId', '11777' );

    $('#signup-box-wrapper #signup-box').submit( login );
    $('#signup-box-wrapper #signup-box #forgot-password-wrapper').click( forgotPassword );

};

function login ( event ) {

    event.preventDefault();

    var email = $('#signup-box-wrapper #signup-box #email input').val();
    var password = $('#signup-box-wrapper #signup-box #password input').val();
    var keepMeLoggedIn = $('#signup-box-wrapper #signup-box #keep-logged-in input').prop('checked');

    $.post( HOST + '/api/user/signin', {
        email:      email,
        password:   password
    }, function ( result ) {

        $('#signup-box-wrapper #signup-box #email .error').css({ opacity: 0 });
        $('#signup-box-wrapper #signup-box #password .error').css({ opacity: 0 });

        if ( result.ok === 1 ) {

            localStorage.setItem( 'email', result.email );
            localStorage.setItem( 'hash', result.hash );
            localStorage.setItem( 'lastLogin', Date.now() );
            localStorage.setItem( 'keepMeLoggedIn', keepMeLoggedIn );

            window.location = HOST + '/';

        } else {

            if ( result.errCode === 1 ) {

                $('#signup-box-wrapper #signup-box #email .error').css({ opacity: 1 });
                $('#signup-box-wrapper #signup-box #email .error').html( result.err );

            } else if ( result.errCode === 2 ) {

                $('#signup-box-wrapper #signup-box #password .error').css({ opacity: 1 });
                $('#signup-box-wrapper #signup-box #password .error').html( result.err );

            }

        }

    });

};

function forgotPassword ( event ) {

    alert( 'Not ready yet.' );

};

$( document ).ready( init );
