angular.module( 'devilib' )
.controller( 'LogOutCtrl', [ 'logOut', '$scope', '$location', function ( logOut, $scope, $location ) {

	this.apply = function () {

		logOut.request( this, function ( responce ) {

			var message = '';

            switch ( responce.message ) {

                case 1:
                    message = 'User wasn\'t found';
                    break;

                case 2:
                    message = 'You successfully removed session';
                    localStorage.setItem( 'email', responce.email );
                    localStorage.setItem( 'session', responce.session );

                    $location.path( '/' );
                    $scope.$apply();
                    break;

                default:
                    message = 'OOPS! Something wrong!';
            
            }
            
            alert( message );

		});

	}

}]);