
var User = {};


User.signin = function ( req, res ) {
	
	console.log( req.body.email );

	var email = req.body.email;
	var password = req.body.password;

    console.log( email, password );


	api.user.signin( email, password, function ( err, result ) {

		if( !err ) {

			if ( result === 'Error' ) {
				
				return res.send('hey Error');

			} else if ( result.message === 1 ) {
				
				return res.send( { message: 1, email: '', session: '' } );

			} else if ( result.message === 2 ) {
				
				return res.send( { message: 2, email: '', session: '' } );

			} else if ( result.message === 3 ) {

				return res.send( { message: 3, email: result.email, session: result.session } );

			}

		}	

	});

};

User.signup = function ( req, res ) {

	var email = req.body.email;
	var password = req.body.password;

	api.user.signup( email, password, function ( err, result ) {
	
		if ( result.message === 1 ) {

			return res.send( { message: 1 } );

		} 

		if ( result.message === 2 ) {

			return res.send( { message: 2 } );

		} 

		if ( result.message === 3 ) {
		
		return res.send( { message: 3 } );
	    
	    }

		if( !err ) {

			if ( result.message === 4 ) {

				return res.send( { message: 4 } );

			} else if ( result.message === 5 ) {

				return res.send( { message: 5, email: email, password: password } );

			}
		}
	
	});

}

User.logout = function ( req, res ) {

	var email = req.body.email;
	var currentSession = req.body.session;

	console.log( 'req.body.email ' + req.body.email );
    console.log( 'req.body.session ' + req.body.session );

	api.user.logout( email, currentSession, function ( err, result ) {

		if( !err ) {

			if ( result === 'Error' ) {
				
				return res.send( 'hey Error' );

			} else if ( result.message === 1 ) {
				
				return res.send( { message: 1 } );

			} else if ( result.message === 2 ) {
				
				return res.send( { message: 2, email: '', session: '' } );

			} 

		}	

	});

};

module.exports = User;
