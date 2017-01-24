angular.module( 'goodweed' )
.factory( 'auth', [ '$http', '$window', '$q', 'SharedState',  function ( $http, $window, $q, SharedState ) {

	var auth = {
		phone: false
	};

	auth.saveToken = function ( token ) {
		
		createCookie( 'goodweed', token, 10 );
		console.log( 'save' );
	
	};

	auth.getToken = function () {
		console.log( 'get' );
		return readCookie( 'goodweed' );
	
	};

	auth.saveUser = function ( user ) {
		
		createCookie( 'goodweedUser', user, 10 );
	
	};

	auth.getUser = function () {
		
		return readCookie( 'goodweedUser' );
	
	};

	auth.register = function () {

		return $http.post('/register').then( function ( responce ) {

			auth.saveToken( responce.data.result.token );

		}, function ( error ) {

			console.log( error );

		});
	
	};

	auth.isLoggedIn = function () {

		if ( !auth.getToken() ) return auth.register();

		var deferred = $q.defer();

		deferred.resolve( auth.getToken() );

		return deferred.promise;

	};

	auth.forgotPin = function ( phone ) {

		return $http.post( '/forgot', { phone: phone }, { headers: { token: auth.getToken() } }).then( function ( responce ) {

			console.log( responce );

			SharedState.turnOff( 'forgotPin' );
			SharedState.turnOn( 'verifyAccount' );

		}, function ( error ) {

			console.log( error );

		});

	};

	auth.addPhone = function ( phone ) {

		return $http.post( '/phone/add', { phone: phone }, { headers: { token: auth.getToken() } }).then( function ( responce ) {

			console.log( responce );

		}, function ( error ) {

			console.log( error );

		});

	};

	auth.phoneSignIn = function ( phone, pin, callback ) {

		return $http.post('/phone/signIn', { phone: phone, pin: pin }, { headers: { token: auth.getToken() } } ).then( function ( responce ) {

			console.log( responce );

			callback( responce );

		}, function ( error ) {

			console.log( error );

		});

	};

	function createCookie( name, value, days ) {
	    
	    if ( days ) {
	        var date = new Date();
	        date.setTime( date.getTime() + (days*24*60*60*1000) );
	        var expires = "; expires="+date.toGMTString();
	    }

	    else var expires = "";
	    document.cookie = name + "=" +value + expires + "; path=/";
	
	}

	function readCookie( name ) {
	    
	    var nameEQ = name + "=";
	    var ca = document.cookie.split( ';' );
	    
	    for( var i = 0; i < ca.length; i++ ) {
	        
	        var c = ca[i];
	        while ( c.charAt( 0 ) ==' ' ) c = c.substring( 1, c.length );
	        if ( c.indexOf( nameEQ ) == 0 ) return c.substring( nameEQ.length, c.length );
	    
	    }
	    
	    return null;
	
	}

	function eraseCookie( name ) {
	    createCookie( name, "" ,-1 );
	}

	return auth;

}]);