var jwt = require('jsonwebtoken'),
	Q = require("q");

var userService = require("./user");
var expires = 120; //minutes
var privateKey = process.env.AUTHENTICATION_KEY;

module.exports = (function() {

	var getExpiration = function(minutes) {

		// Now in seconds
		var now = parseInt((new Date()).getTime() / 1000);

		return now + (60 * +minutes);

	};

	var verify = function(token) {

		var deferred = Q.defer();
		jwt.verify(token, privateKey, function(err, data) {

			if (err) {
				console.log(err, err.stack);
				deferred.reject(err);
			}

			deferred.resolve(data);

		});

		return deferred.promise;

	};

	var sign = function(data) {

		return jwt.sign(data, privateKey);

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
				exp: getExpiration(expires), // Expires in 60 minutes
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
				exp: getExpiration(expires), // Expires in 60 minutes
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

})();
