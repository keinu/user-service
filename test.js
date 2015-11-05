var user = require("./index");

user.authenticationService.getToken("test@example.net", "mystrongestpassword").then(user.authenticate).then(function(user) {

	console.log("UserID: ", user);

}).fail(function(err){

	console.log(err);

});