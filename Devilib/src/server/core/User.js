//User file
var crypto = require('crypto');

var genRandomString = function ( length ) {
    
    return crypto.randomBytes( Math.ceil( length/2 ) )
            .toString( 'hex' )
            .slice( 0, length ); 

};

var passwordHashing = function ( password, salt ){
    
    var hash = crypto.createHmac( 'sha256', salt );
    hash.update( password );
    var value = hash.digest( 'hex' );
    return {
        salt: salt,
        passwordHash: value
    };   

};

var generateKey = function () {

    var sha = crypto.createHash( 'sha256' );
    sha.update( Math.random().toString() );
    return sha.digest( 'hex' );

};

var find = function ( arr, value ) {

    if ( arr.indexOf ) {
    
        return arr.indexOf( value );
    
    }

    for ( var i = 0; i < arr.length; i++ ) {
        
        if ( arr[i] === value ) { 

            return i;

        }
    
    }

    return -1;

};

var User = {};

User.signin = function ( email, password, callback ) {

    DB.User
    .findOne( { email: email } )
    .exec( function ( err, user ) {

        if ( err ) {

            return callback( err );

        }

        if ( ! user ) {

            return callback( null, { message: 1, email: '', session: '' } );

        }

        var passwordData = passwordHashing( password, user.salt );
        var hashedPass = passwordData.passwordHash;

        if ( user.hash !== hashedPass ) {

            return callback( null, { message: 2, email: '', session: '' } );

        }

        if ( user && hashedPass ) {

            var currentSession = generateKey();
            user.sessions.push( currentSession );
            user.save( function ( err ) {
                
                if ( err ) {
                
                    console.error( err );
                
                }

            });

            return callback( null, { message: 3, email: email, session: currentSession }  );

        }

    });

    console.log( 'User core method "signin" called.' );

};

User.signup = function ( email, password, callback ) {
    
    if ( email ) {

        if ( email.length < 3 ) {

            return callback( null, { message: 1 } );

        }

        if ( password.length < 5 ) {

            return callback( null, { message: 2 } );

        }

        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        if ( !re.test( email ) ) {

            return callback( null, { message: 3 } );

        }

        DB.User
        .findOne({
            email: email
        }).exec( function ( err, user ) {

            if ( err ) {

                return callback( err );

            }

            if ( user && user.email === email ) {

                return callback( null, { message: 4 } );

            }

            var salt = genRandomString( 16 );
            var passwordData = passwordHashing( password, salt );
            var sessions = [];

            DB.User
            .create({
                email: email,
                hash: passwordData.passwordHash,
                salt: passwordData.salt,
                sessions: sessions
            }, function ( err, res ) {

                return callback( null, { message: 5 } );

            });

        });

    }

};

User.logout = function ( email, currentSession, callback ) {

    console.log( 'email ' + email );

    console.log( 'current session ' + currentSession );

    DB.User
    .findOne( { email: email } )
    .exec( function ( err, user ) {

        if ( err ) {

            return callback( err );

        }

        if ( ! user ) {

            return callback( null, { message: 1 } );

        }

        var index = find( user.sessions, currentSession );

        console.log( 'index ' + index );

        if ( user || index > -1 ) {

            user.sessions.splice( index, 1 );
            user.save( function ( err ) {
                
                if ( err ) {
                
                    console.error( err );
                
                }

            });

            return callback( null, { message: 2, email:'', session: '' } );

        }

    });

    console.log( 'User core method "logout" called.' );

};

module.exports = User;
