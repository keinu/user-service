var UserService = require("./index");
	userService = new UserService({
		expires: 10,
		authenticationKey: "TEST"
	});

var t;
userService.authenticationService.getToken("test@test.test", "test").then(function(token) {

	t = token;
	token = "Bearer " + token;

	return userService.authenticate(token);

}).then(function(user) {

	console.log("UserID: ", user);

	return userService.authenticationService.verify(t);

}).then(function() {

	console.log(arguments);

}).fail(function(err){

	console.error(err);
	console.trace(err.stack);

});