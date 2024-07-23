// This configuration file is used to set up the schema in our database
// to hold information abou the user

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const {Schema} = mongoose

const UserSchema = new Schema ({
    email: {
        type: String,
        required: true
 },
    password: {
        type: String,
        required: true
 }
})

// this handles saving a new username and password to the system.
UserSchema.pre('save', async function(next) {
    try {
        // check method of registration
        const user = this;
        if (!user.isModified('password')) next();
        // generate salt
        const salt = await bcrypt.genSalt(10);
        // hash the password
        const hashedPassword = await bcrypt.hash(this.password, salt);
        // replace plain text password with hashed password
        this.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

// This handles checking to make sure that the password is correct and matching.
UserSchema.methods.matchPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    }catch (error){
        throw new Error(error);
    }
};
   

const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;
