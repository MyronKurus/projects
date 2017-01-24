angular.module('goodweed', [ 'ngRoute', 'mobile-angular-ui' ])
.config( function( $routeProvider ) {

	$routeProvider.when( '/', {
		templateUrl: '/templates/redeem.html',
		resolve: {
			allDealsPromise: [ 'auth', function ( auth ) {
				return auth.isLoggedIn()
			}]
		},
		reloadOnSearch: false
	})
	.when( '/deals', {
		templateUrl: '/templates/deals.html',
		resolve: {
			allDealsPromise: [ 'deals', 'auth', function ( deals, auth ) {
				return auth.isLoggedIn().then( function (responce) {
					return deals.getAllDeals();
				});
			}]
		},
		reloadOnSearch: false
	})
	.when( '/featured-deals', {
		templateUrl: '/templates/featured-deals.html',
		resolve: {
			featuredDealsPromise: [ 'deals', 'auth', function ( deals, auth ) {
				return auth.isLoggedIn().then( function (responce) {
					return deals.getFeaturedDeals();
				});
			}]
		},
		reloadOnSearch: false
	})
	.otherwise({
		resolve: {
			codePromise: [ '$q', '$location', 'deals', 'auth', function ( $q, $location, deals, auth ) {
				return auth.isLoggedIn().then( function() {
					return deals.redirectCode( $location.path().substring(1) ).then( function ( responce ) {
						var deffered = $q.defer();
						$location.path('/');
						deffered.resolve('Success');
						return deffered.promise;
					});
				});
			}]
		}
	});

});
