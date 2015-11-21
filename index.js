var userService = require("./services/user"),
	registrationService = require("./services/registration");

module.exports = function(options) {

	var AuthenticationService = require("./services/authentication"),
		authenticationService = new AuthenticationService({
			expires: options.expires,
			authenticationKey: options.authenticationKey
		});

	var authenticate = function(token) {

		token = token.split(" ")[1] || token;
		return authenticationService.verify(token).then(function(token) {
			return token.id;
		});

	};

	return {
		userService: userService,
		authenticationService: authenticationService,
		registrationService: registrationService,
		authenticate: authenticate
	};

};
