var scrypt = require("scrypt"),
    SimpleDynamo = require("node-simple-dynamo");

var database = SimpleDynamo({}, {
    region: "eu-west-1",
    dynamodb: '2012-08-10',
    // endpoint: "http://localhost:8088"
});

exports.createUser = function(user) {

    if (!process.env.SALT) {
        throw new Error("Authentication salt is not defined");
    }

    return scrypt.hash(user.password, {
        "N": 16,
        "r": 1,
        "p": 1
    }, 64, process.env.SALT).then(function(result) {

        user.password = result.toString("hex");
        return database.create("is-users", user);

    });

};

exports.getUsers = function(email) {

    return database.list("is-users", [{
        key: "email",
        operator: "EQ",
        value: email
    }]);

};

exports.getUserByEmailAndPassword = function(email, password) {

    if (!process.env.SALT) {
        throw new Error("Authentication salt is not defined");
    }

    // Cannot use as promise, lack of fail handler
    var result = scrypt.hashSync(password, {
        "N": 16,
        "r": 1,
        "p": 1
    }, 64, process.env.SALT);

    return database.query("is-users", [{
        key: "email",
        operator: "EQ",
        value: email
    },{
        key: "password",
        operator: "EQ",
        value: result.toString("hex")
    }], "EmailPasswordIndex").then(function(users) {

        if (users.length !== 1) {
            throw new Error(["User not found"]);
        }

        return users[0];

    });

};

exports.getUserByEmail = function(email) {

    return database.query("is-users", [{
        key: "email",
        operator: "EQ",
        value: email
    }], "EmailIndex").then(function(users) {

        if (users.length !== 1) {
            throw new Error(["User not found"]);
        }

        return users[0];

    });

};


exports.getUser = function(id) {

    return database.get("is-users", id);

};

exports.updateUser = function(user) {

    if (!user.id) {
        throw new Error("A user Id must be specified");
    }

    return database.update("is-users", user);

};
