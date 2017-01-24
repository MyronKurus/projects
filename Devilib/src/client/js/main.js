angular.module('devilib', ['ngRoute'])
.config( ['$routeProvider', '$locationProvider', function ( $routeProvider, $locationProvider ) {
	
	$routeProvider.when( '/', {
		
		templateUrl: 'templates/main.html',
		reloadOnSearch: false
	
	})
	.when( '/signin', { 

		templateUrl: '/templates/signIn.html'

	})
	.when( '/signup', { 

		templateUrl: '/templates/signUp.html'

	})
	.when( '/home', { 

		templateUrl: '/templates/home.html'

	})

	.when( '/registered', { 

		templateUrl: '/templates/test.html'

	})

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});

}]);