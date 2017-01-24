var express = require('express');
var router = express.Router();
var request = require('request');

//

var apiUrl = config.apiUrl;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Goodweed',
	});
});

router.post('/', function(req, res, next) {
	res.render('index', {
		title: 'Goodweed',
	});
});

router.get('/featuredDeals', function ( req, res, next ) {

	request({
		method: 'GET',
		url: apiUrl + 'api/v1/users/deals/featured',
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': req.headers.token
		}
	}, function ( error, responce, body ) {

		if ( error ) return next( error );

		res.send( body );

	});

});

router.get('/deals', function ( req, res, next ) {

	request({
		method: 'GET',
		url: apiUrl + 'api/v1/users/deals',
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': req.headers.token
		}
	}, function ( error, responce, body ) {

		if ( error ) return next( error );

		res.send( body );

	});

});

router.post('/addDeal', function ( req, res, next ) {

	request({
		method: 'POST',
		url: apiUrl + 'api/v1/users/deals',
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': req.headers.token
		},
		json: {
			_id: req.body.id,
			store: req.body.store
		}
	}, function ( error, responce, body ) {

		if ( error ) return next( error );

		res.send( body );

	});

});

router.post('/deals/:id/redeem', function ( req, res, next ) {

	request({
		method: 'POST',
		url: apiUrl + 'api/v1/users/deals/' + req.params.id + '/redeem',
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': req.headers.token
		}
	}, function ( error, responce, body ) {

		if ( error ) return next( error );

		res.send( body );

	});

});

router.post('/assign', function ( req, res, next ) {

	request({
		method: 'POST',
		url: apiUrl + 'api/v1/users/deals/assign',
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': req.headers.token
		},
		json: {
			campaign: req.body.campaign
		}
	}, function ( error, responce, body ) {

		if ( error ) return next( error );

		res.send( body)

	});

});

router.delete('/deals/:id', function ( req, res, next ) {

	request({
		method: 'DELETE',
		url: apiUrl + 'api/v1/users/deals/' + req.params.id,
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': req.headers.token
		}
	}, function ( error, responce, body ) {

		if ( error ) return next( error );

		res.send( body );

	});

});

router.post('/register', function ( req, res, next ) {

	request({
		method: 'POST',
		url: apiUrl + 'api/v1/users/signup',
		headers: {
			'Content-Type': 'application/json'
		}
	}, function ( error, responce, body ) {

		if ( error ) return next( error );

		res.send( body );

	});

});

router.post('/forgot', function ( req, res, next ) {

	request({
		method: 'POST',
		url: apiUrl + 'api/v1/users/phone/forgot',
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': req.headers.token
		}, 
		json: {
			phone: req.body.phone
		}
	}, function ( error, responce, body ) {

		if ( error ) return next( error );

		res.send( body );

	});

});

router.post('/phone/add', function ( req, res, next ) {

	request({
		method: 'POST',
		url: apiUrl + 'api/v1/users/phone',
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': req.headers.token
		},
		json: {
			phone: req.body.phone
		}
	}, function ( error, responce, body ) {

		if ( error ) return next( error );

		res.send( body );

	});

});

router.post('/phone/signIn', function ( req, res, next ) {

	request({
		method: 'POST',
		url: apiUrl + 'api/v1/users/signin/phone',
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': req.headers.token
		},
		json: {
			phone: req.body.phone,
			pin: req.body.pin
		}

	}, function ( error, responce, body ) {

		if ( error ) return next( error );

		res.send( body );

	});

});

module.exports = router;