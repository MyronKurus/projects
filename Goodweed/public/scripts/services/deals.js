angular.module('goodweed')
.factory('deals', [ '$http', 'SharedState', 'auth', '$q', function ( $http, SharedState, auth, $q ) {

	var o = {
		deals: [],
		featured: [],
		assigned: false,
		added: false,
		redeem: false
	};

	o.getFeaturedDeals = function () {
		return $http.get('/featuredDeals', { headers: { token: auth.getToken() } }).then( function ( responce ) {

			o.featured = responce.data.result;
			addBackground( o.featured );

		}, function ( error ) {

			console.log( error );

		});
	};

	o.getAllDeals = function () {
		return $http.get('/deals' , { headers: { token: auth.getToken() } }).then( function ( responce ) {

			o.deals = responce.data.result;
			if ( o.deals.length ) addBackground( o.deals );

		}, function ( error ) {

			console.log( error );

		});
	};

	o.addDeal = function ( id, store ) {
		console.log( id, store );
		return $http.post('/addDeal', { id: id, store: store }, { headers: { token: auth.getToken() } }).then( function ( responce ) {

			o.deals.unshift( o.added );
			o.added = false;

			SharedState.turnOn('featuredDealsPopup');

		}, function ( error ) {

			console.log( error );

		});
	};

	o.redeemDeal = function ( id ) {
		console.log( id );
		return $http.post('/deals/' + id + '/redeem', {}, { headers: { token: auth.getToken() } }).then( function ( responce ) {

			for ( var i = 0; i < o.deals.length; i++ ) {

				if ( o.deals[ i ]._id === id ) {

					o.deals.splice( i, 1 );
					break;

				}

			}

			SharedState.turnOff('redeemPopup');

		}, function ( error ) {

			console.log( error );

		});
	};

	o.assignDeal = function ( campaign ) {
		console.log( campaign );
		return $http.post('/assign', { campaign: campaign }, { headers: { token: auth.getToken() } }).then( function ( responce ) {
console.log( responce );
			if ( responce.data.result ) {

				o.assigned = responce.data.result;

				o.assigned.background = '#F2FDFF';
				o.assigned.border = '#62a8b7';

				SharedState.turnOn('youWon');

			} else {

				SharedState.turnOn('wrongCodePopup');

			}

		}, function ( error ) {

			console.log( error );

		});
	};

	o.removeDeal = function ( id ) {
		console.log( id );
		return $http.delete('/deals/' + id, { headers: { token: auth.getToken() } }).then( function ( responce ) {

			for ( var i = 0; i < o.deals.length; i++ ) {

				if ( o.deals[ i ]._id === id ) {

					o.deals.splice( i, 1 );
					break;

				}

			}

		}, function ( error ) {

			console.log( error );

		});
	};

	o.redirectCode = function ( code ) {

		var deffered = $q.defer();
		o.code = code;
		deffered.resolve('Success');

		return deffered.promise;

	};

	var addBackground = function ( deals ) {

		var backgrounds = [ '#F2FDFF', '#FFF3BC', '#FFE5E5' ];
		var borders = [ '#62a8b7', '#A79335', '#C89393' ];

		for ( var i = 0; i < deals.length; i ++ ) {

			deals[ i ].background = backgrounds[i] || '#F2FDFF';
			deals[ i ].border = borders[i] || '#62a8b7';

		}

	};

	return o;

}]);