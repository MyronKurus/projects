angular.module( 'goodweed' )
.controller( 'FeaturedDealsCtrl', [ 'deals', function ( deals ) {

	this.deals = deals.featured;

	this.addDeal = function ( id, store, deal ) {

		deals.added = deal;

		deals.addDeal( id, store );

	};

}]);