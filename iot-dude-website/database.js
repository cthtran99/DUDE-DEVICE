const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Import our code from config.js
var token_stuff = require('./config.js');
// {token_info} should be a string that is the url for the mongodb driver, 
// this is to prevent creditential leaks.
// You can also replace this with the string of the mongodb you want to use.
const dbUrl = token_stuff.token_info;

// This handles connecting to our database in order to authenticate users to our website.
const connect = async () => {
    mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on("error", () => {
        console.log("could not connect");
    });
    db.once("open", () => {
    console.log("> Successfully connected to database");
    });
};

module.exports = { connect };