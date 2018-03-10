const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const keys = require('../config/keys');

const User = require('../models/User');

module.exports = (passport) => {
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        },
        (accessToken, refreshToken, profile, done) => {
            const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
            User.findOne({ googleID: profile.id }).then(user => {
                if (user) {
                    // Log the user in
                    done(null, user);
                } else {
                    // Register the user
                    const newUser = {
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        googleID: profile.id,
                        image: image
                    }
                    new User(newUser).save().then(user => {
                        // Log the user in
                        done(null, user);
                    })
                }
            })
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => done(error, user));
    });    
}