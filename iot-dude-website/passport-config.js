const LocalStrategy = require('passport-local').Strategy
const passport = require('passport');
// userModel.js includes the information needed to generate
// the necessary entires for username in the database.
const User = require('./userModel.js')
module.exports = (passport) => {
  // This is used to sign up users into the database.
  passport.use(
  "local-signup",
  new LocalStrategy(
  {
   usernameField: "email",
   passwordField: "password",
   },
async (email, password, done) => {
 try {
  console.log("Accessing database to edit users")
    // check if user exists
  const userExists = await User.findOne({ "email": email });
  if (userExists) {
    return done(null, false)
  }
 // Create a new user with the user data provided
  const user = await User.create({ email, password });
  return done(null, user);
 }catch (error) {
    done(error);
 }
}
)
);
// This is used in order to check if the username and password is correct.
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async(email, password, done) =>{
    try{
      const user = await User.findOne({email:email});
      if(!user) return done(null, false, { message: 'No user with that email' });
      const isMatch = await user.matchPassword(password);
      if(!isMatch) return done(null, false, { message: 'Password incorrect' });
      // if match, return user
      return done(null, user);
    } catch (error){
      console.log(error)
      return done(error, false);
    }
  }
  )
)

// This is used to autheticate user sessions locally onboard the server.
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
}

 