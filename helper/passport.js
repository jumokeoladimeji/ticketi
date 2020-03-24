const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../database/models');
const auth = require('../middleware/authentication');

  /**
 * @description - Signs in the user
 * @param {object} request - request object received from the client
 * @param {object} response - response object served to the client
 * @returns {json} message, response or error
 */
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
    User.findOne({ where: { email } }).then((user) => {
        if (!user || !auth.validPassword(password, user.hashedPassword)) {
            return done(null, false, { message: { 'email or password': 'is invalid' } });
        }
        const userinfo = user.get();
        return done(null, userinfo);
    })
    .catch(done);
}));