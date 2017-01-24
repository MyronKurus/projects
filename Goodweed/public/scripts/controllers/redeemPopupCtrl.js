angular.module( 'goodweed' )
.controller( 'RedeemPopupCtrl', [ 'deals', function ( deals ) {

	this.redeem = deals.redeem;

	this.redeemDeal = function () {

		deals.redeemDeal( this.redeem );
		var app = document.getElementsByClassName( 'app' );
		app[0].classList.remove( 'blur' );

	};

	this.removeBlur = function () {

		var app = document.getElementsByClassName( 'app' );
		app[0].classList.remove( 'blur' );

	};

}]);