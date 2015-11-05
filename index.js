var authenticationService = require("./services/authentication");
	//registrationService = require("./services/registration");
var userService = require("./services/user");

module.exports = (function() {

	var authenticate = function(token) {

		return authenticationService.verify(token).then(function(token) {
			return token.id;
		});

	};

	return {
		userService: userService,
		authenticationService: authenticationService,
		authenticate: authenticate
	};

})();
