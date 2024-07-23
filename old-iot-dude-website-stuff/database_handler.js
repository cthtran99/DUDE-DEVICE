// This is file that we'll use to contact to the database and get our results.
// For the most part, we shouldn't be caring about what is being handled here aside from
// passing in information from the website to and from the database.

// To call this file, add the following line to the .js file:
// var foo = require('database_handler.js');

// Import the MongoDB driver.
const { MongoClient, ServerApiVersion } = require('mongodb');

// Import our code from config.js
var token_stuff = require('./config.js');// {token_info} should be a string that is the url for the mongodb driver, this is to prevent creditential leaks

// Import our code from username_mode.js
var mongoose = require('mongoose'),
    usernameModel = require('./username_model.js');

const db_client = new MongoClient(token_stuff.token_info,{ useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// Helper function that handles login details

// This creates a new user in the database.
function createUser(username_input, password_input){
    try{
        mongoose.connect(token_stuff.token_info);
        var new_user = new usernameModel({     
            email : username_input,
            password: password_input
        });
        new_user.markModified('usernames');
        new_user.save(function(err){
            if(err) console.log(err)
        });
    }finally{
        mongoose.connection.close();
    }
}

// This verifies if a combination of username + password is correct.
async function checkUsername(username_input, password_input){
    var test;
    try{
    await mongoose.connect(token_stuff.token_info);
    console.log("Looking for username: ", username_input);
    usernameModel.findOne({email: username_input}, async function(err,email){
        console.log("Checking for password for:", username_input);
        await new Promise(r => setTimeout(r, 2000)); // It takes time for the system to validate the username.
        if(err) throw err;
        email.passwordCheck(password_input, function(err, isMatch){
            if(err) throw err;
            console.log("Verfication Test Result: ", isMatch);
            test = isMatch;
            return isMatch;
        });
    });
    await mongoose.connection.close();
    await new Promise(r => setTimeout(r, 4000)); // It takes time for the system to validate the username.
    console.log("return result:", test);
    } catch(err){
        console.log("errors:", err);
    }
    return test;
}

// Password Recovery System

passwordRecovery = require('./username_update_model');

// This function generates a token to allow the user to edit a particular username.
async function generateToken(username_input, salt_token){
    try{
        await mongoose.connect(token_stuff.token_info);
        usernameModel.findOne({email: username_input}, async function(err,email){
            console.log("Located Username:", username_input);
            await new Promise(r => setTimeout(r, 2000)); // It takes time for the system to validate the username.
            var newToken = new passwordRecovery({
                email : username_input,
                password : salt_token
            });
            console.log("Token Setup:", salt_token);
            newToken.markModified("token");
            newToken.save();
        });
    }finally{
        // mongoose.connection.close();
    }
}

// This function validates a token to make sure that the user can edit the function.
// username_input would be the username, and then password_input would be the token being used.
async function checkRecovery(username_input, password_input){
    var test;
    try{
    await mongoose.connect(token_stuff.token_info);
    console.log("Looking for username: ", username_input);
    passwordRecovery.findOne({email: username_input}, async function(err,email){
        console.log("Checking for token for:", username_input);
        // await new Promise(r => setTimeout(r, 2000)); // It takes time for the system to validate the username.
        if(err) throw err;
        email.passwordCheck(password_input, async function(err, isMatch){
            if(err) throw err;
            console.log("Verfication Token Result: ", isMatch);
            test = isMatch;
            return isMatch;
        });
    });
    await mongoose.connection.close();
    } catch(err){
        console.log("errors:", err);
    }
    return test;
}

// This function changes the password by creating a new entry for the username.
// Note that this function will also destroy a preexisting token on the spot.
async function updatePassword(username_input, password_input){
    try{
        await mongoose.connect(token_stuff.token_info);
        console.log("Attempting password update.");
        await passwordRecovery.deleteOne({email: username_input});
        await usernameModel.deleteOne({email : username_input});
        var new_user = new usernameModel({     
            email : username_input,
            password: password_input
        });
        new_user.markModified('usernames');
        new_user.save(function(err){
            if(err) console.log(err)
        });
    }finally{
        // mongoose.connection.close();
    }
}

// The way this is done is very inefficient. What should be done is that we are 
// connecting whenever we start the server and stop when the server is done.
// However not sure how to implement that right now.

async function database_run(){
    try{
        await client.connect();
        // sample
    } finally {
        await client.close();
    }
}

// createUser("hello@example.com", "passwords");
// checkUsername("hello@example.com", "passwords");

// generateToken("%email%");
// checkRecovery("%email%", "%generated%");

// Alright in order to export, it'll be from the database handler.

const fs = require('fs'); // needed to write to filesystems

async function downloadDatabase(){
    try{
        console.log('Attempting to download.');
        const db = db_client.db('sample_weatherdata');
        downloadData(db, function(docs){
            try{
                fs.writeFileSync(__dirname + '/export.json', JSON.stringify(docs));
            }
            catch(err){
                console.log('Error writing file');
            }
        });
        console.log('Task Attempted');
    }finally{
        // mongoose.connection.close();
    }
}

async function downloadData(database, callback){
    const query = {};
    database.collection("data")
    .find(query)
    .toArray(function(err,result){
        if(err) throw err;
        callback(result);
    });
};

module.exports = {
    createUser,
    checkUsername,
    generateToken,
    checkRecovery,
    updatePassword,
    downloadDatabase
};