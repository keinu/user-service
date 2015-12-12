var UserService = require("./index");
	userService = new UserService({
		expires: 10,
		authenticationKey: "TEST",
		registrationKey: "TEST"
	});

// var t;
// userService.authenticationService.getToken("xabi@keinu.net", "qwer").then(function(token) {

// 	t = token;
// 	token = "Bearer " + token;

// 	return userService.authenticate(token);

// }).then(function(user) {

// 	console.log("UserID: ", user);

// 	return userService.authenticationService.verify(t);

// }).then(function() {

// 	console.log(arguments);

// }).fail(function(err){

// 	console.error(err);
// 	console.trace(err.stack);

// });


var registrationService = new userService.registrationService({
	expires: 24, //hours
	registrationKey: "TEST",
	from: "TEST <test@keinu.net>"
});

registrationService.register({
	name: "bo",
	email: "bo11@keinu.net",
	password: "pwd"
}).then(function(data) {
	console.log(data);
}).catch(function(err) {
	console.log(err);
	console.trace(err.stack);
});