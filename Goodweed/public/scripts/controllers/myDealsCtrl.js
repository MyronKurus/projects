angular.module( 'goodweed' )
.controller( 'MyDealsCtrl', [ 'deals', function ( deals ) {

	this.deals = deals.deals;

	this.redeem = function ( id ) {

		deals.redeem = id;
		var app = document.getElementsByClassName( 'app' );
		app[0].classList.add( 'blur' );

	};

	this.remove = function ( id ) {

		deals.removeDeal( id );

	};

}]);