angular.module( 'goodweed' )
.controller( 'MainCtrl', [ 'auth', 'SharedState', '$location', function ( auth, SharedState, $location ) {

	this.checkPhone = function () {

		var user = ( auth.getUser() ) ? JSON.parse( auth.getUser() ) : false;

		console.log( user );

		if ( user && user.phone ) {

			$location.path( '/deals' );

		} else {

			SharedState.turnOn( 'signIn' );

		}

	};

}]);
