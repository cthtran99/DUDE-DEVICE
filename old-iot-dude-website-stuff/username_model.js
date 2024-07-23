// Username Setup
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
bcrypt = require('bcrypt'),
ROUNDS_OF_SALT = 10;

var usernameSetup = new Schema({
    email:{type: String, required: true, index:{unique:true}},
    password:{type: String, required: true}
});

// Function used to set up a username.
usernameSetup.pre('save', async function(next){
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
usernameSetup.methods.passwordCheck = function(userSubmittedPassword, cb){
    var matching;
    bcrypt.compare(userSubmittedPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        matching = isMatch;
        cb(null, isMatch);
    });
    return matching;
};


module.exports = mongoose.model('usernames', usernameSetup);
