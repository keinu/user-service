var user = require("./index");

user.authenticationService.getToken("xabi@keinu.net", "qwer").then(function(token) {

	token = "Bearer " + token;
	return user.authenticate(token);

}).then(function(user) {

	console.log("UserID: ", user);

}).fail(function(err){

	console.log(err);

});