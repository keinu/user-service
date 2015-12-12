var userService = require("./services/user");

module.exports = function(options) {

	var authenticate = function(token) {

		token = token.split(" ")[1] || token;
		return authenticationService.verify(token).then(function(token) {
			return token.id;
		});

	};

	return {
		userService: userService,
		authenticationService: require("./services/authentication"),
		registrationService: require("./services/registration"),
		authenticate: authenticate
	};

};
