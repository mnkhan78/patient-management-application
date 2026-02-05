const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user.model');

passport.use (new LocalStrategy( async function(username, password, done) {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      console.log('user not matched');
      
      return done(null, false, { message: 'Incorrect username.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('password not matched');
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

module.exports = passport;