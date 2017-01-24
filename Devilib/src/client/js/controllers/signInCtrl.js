angular.module( 'devilib' )
.controller( 'SignInCtrl', [ 'signIn', '$scope', '$location', function ( signIn, $scope, $location ) {

	this.apply = function () {

		signIn.request( this, function ( responce ) {

            var message = '';

            switch ( responce.message ) {
                
                case 1:
                    message = 'You must sign up before sign in!';
                    break;
              
                case 2:
                    message = 'This password isn\'t valid!';
                    break;

                case 3:
                    message = 'You were logined successfully!';
                    localStorage.setItem( 'email', responce.email );
                    localStorage.setItem( 'session', responce.session );

                    $location.path( '/home' );
                    $scope.$apply();
                    
                    break;

                default:
                    responce.message = 'Wrong combination!';
            
            }
            
            $( '#responce' ).html( message );

		});

	};

}]);