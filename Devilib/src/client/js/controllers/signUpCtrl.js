angular.module( 'devilib' )
.controller( 'SignUpCtrl', [ 'signUp', '$scope', '$location', function ( signUp, $scope, $location ) {

    this.login = signUp.login;
    var scope = this;

    this.apply = function () {

		signUp.request( this, function ( responce ) {

			var message = '';

            switch ( responce.message ) {

                case 1:
                    message = 'Email should be longer then 3 chars.';
                    break;
              
                case 2:
                    message = 'Password should be longer then 5 characters.';
                    break;

                case 3:
                    message = 'Email seems to be bad.';
                    break;

                case 4:
                    message = 'This email already exists';
                    break;

                case 5:
                    message = 'Welcome new User';
                    $location.path( '/registered' );
                    $scope.$apply();
                    break;

                default:
                    message = 'Wrong combination';
            
            }
            
            alert( responce.email );

		});

	}

}])
.directive('signedUp', function() {
    return {

        restrict: 'E',
        templateUrl: '../../templates/signedUp.html'
    
    };

});