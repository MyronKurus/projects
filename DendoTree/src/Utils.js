/*
 * Utils file
*/

var $ = {};

var crypto = require('crypto');
var rand = require('csprng');

$.idGenerator = {

    next: function () {

        return crypto.createHash('md5').update( ( Math.random() + '' ).slice(2) ).digest('hex');

    }

};

$.hashPassword = function ( password, salt ) {

	if ( salt === undefined ) salt = rand(160,36);

	return { password: crypto.createHash('sha256').update( password + salt ).digest('base64'), salt: salt };

};

module.exports = $;
