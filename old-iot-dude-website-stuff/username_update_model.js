// Username Setup
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
bcrypt = require('bcrypt'),
ROUNDS_OF_SALT = 10;

// This is schema for tokens for fixing usernames. Note while its similar to the username_model.js
// the schema has a created at that expires the token in 60 minutes.
var usernameFix = new Schema({
    email:{type: String, required: true, index:{unique:true}},
    password:{type: String, required: true},
    createdAt: {type: Date, default: Date.now, expires:3600}
});

// Function used to set up a username.
usernameFix.pre('save', async function(next){
    var email = this;
    // Hash only if password is different
    if(!email.isModified('password')){
        return next();
    }
    // Else hash it.
    var hash = await bcrypt.hash(this.password, Number(ROUNDS_OF_SALT));
    email.password = hash;
    next();
});

// Function used to compare username and password.
usernameFix.methods.passwordCheck = function(userSubmittedPassword, cb){
    var matching;
    bcrypt.compare(userSubmittedPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        matching = isMatch;
        cb(null, isMatch);
    });
    return matching;
};

module.exports = mongoose.model('token', usernameFix);
