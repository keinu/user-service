var jwt = require('jsonwebtoken'),
	Promise = require("bluebird");

var jwtVerifyAsync = Promise.promisify(jwt.verify, jwt);

var userService = require("./user");

module.exports = function(options) {

	if (!options) {
		options = {};
	}

	options.expires = options.expires ? options.expires : 15; // 15 minutes
	options.authenticationKey = options.authenticationKey ? options.authenticationKey : process.env.AUTHENTICATION_KEY;

	if (!options.authenticationKey) {
		throw new Error("Authentication key missing");
	}

	var getExpiration = function(minutes) {

		// Now in seconds
		var now = parseInt((new Date()).getTime() / 1000);

		return now + (60 * +minutes);

	};

	var verify = function(token) {

		return jwtVerifyAsync(token, options.authenticationKey);

	};

	var sign = function(data) {

		return jwt.sign(data, options.authenticationKey);

	};

	var getToken = function(email, password) {

		return userService.getUserByEmailAndPassword(email, password).then(function(user) {

			if (!user.verified) {
				throw {
					"unverified": true
				};
			}

			// Generate and sign a token, with a user id and expiration date
			var newToken = sign({
				exp: getExpiration(options.expires),
				id: user.id
			});

			return newToken;

		});

	};

	var refreshToken = function(token) {

		// Verify the token is valid against the private key
		return verify(token).then(function(tokenData) {

			// Check if the user still exists
	    	return userService.getUser(tokenData.id);

		}).then(function(user) {

			var newToken = sign({
				exp: getExpiration(options.expires),
				id: user.id
			});

			return newToken;

    	});

	};

	var getUserByToken = function(token) {

		return verify(token).then(function(tokenData) {

			// Check if the user still exists
	    	return userService.getUser(tokenData.id);

		});

	};

	return {
		refreshToken: refreshToken,
		getToken: getToken,
		getUserByToken: getUserByToken,
		verify: verify
	};

};
