var jwt = require('jsonwebtoken'),
	Promise = require("bluebird");

var jwtVerifyAsync = Promise.promisify(jwt.verify, jwt);

var userService = require("./user");
var emailService = require("email-service");

module.exports = function(options) {

	if (!options.registrationKey) {
		throw new Error("Registration key missing");
	}

	if (!options) {
		options = {};
	}

	options.expires = options.expires ? options.expires : 15; // 15 minutes
	options.registrationKey = options.registrationKey ? options.registrationKey : process.env.REGISTRATION_KEY;

	var sendVerificationEmail = function(user) {

		var token = jwt.sign({
			id: user.id,
			action: "verify",
			exp: parseInt((new Date()).getTime() / 1000) + (60 * options.expires)
		}, options.registrationKey);

		var email = {
			to: user.name + " <" + user.email + ">",
			from: options.from,
			subject: "Verify your acount",
			html: "Registration: <a href='http://www." + process.env.HOSTNAME + "/registration/verify/" + token + "'>Verify</a>"
		};

		return emailService.sendMail(email).then(function() {

			console.log("Email successfully queued");
			console.log("Token [%s]", token);

		}).catch(function(err) {

			console.log("Email error", err);

		});

	};

	var register = function(user) {

		return userService.getUsers(user.email).then(function(users) {

			if (users.length > 0) {
				throw {
					email: ["This email already exsists"]
				};
			}

			return userService.createUser(user);

		}).then(function(user) {

			sendVerificationEmail(user);

			return user;

		});

	};


	var resend = function(email) {

		return userService.getUserByEmail(email).then(function(user) {

			if (user.verified) {
				throw {
					email: ["This email is already verified"]
				};
			}

			sendVerificationEmail(user);
			return user;

		});

	};

	var verify = function(token) {

		return jwtVerifyAsync(token, registrationKey).then(function(decodedToken) {

			return userService.getUser(decodedToken.id);

		}).then(function(user) {

			user.verified = true;
			console.log("WILL UPDATE VERIFIED USER", user);

			return userService.updateUser(user);

		});

	};


	return {

		verify: verify,
		resend: resend,
		register: register,
		sendVerificationEmail: sendVerificationEmail

	};

};
