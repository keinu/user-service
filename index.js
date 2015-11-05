var authenticationService = require("./services/authentication");
	//registrationService = require("./services/registration");
var userService = require("./services/user");

module.exports = (function() {

	var authenticate = function(token) {

		token = token.split(" ")[1] || token;
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
