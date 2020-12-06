const localStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcrypt');

async function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email);
        // If no User was found.
        if(user == null) {
            // Return error with error message.
            return done(null, false, {message: 'Der eksisterer ingen bruger med den indtastede email.'})
        }

        // Since everything works asynchronis we use try and catch
        try {
            // Match Password with User Password using bcrypt
            if(await bcrypt.compare(password, user.password)) {
                // Return succes
                return done(null, user);
            } else {
                // Return error
                return done(null, false, {message: 'Ukorrekt kodeord.'});
            }
        } catch (error) {
            return done(error)
        }
    } 

    passport.use(new localStrategy({usernameField: 'email'},
    authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    });
}

module.exports = initialize;