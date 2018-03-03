const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const googleOAuthConfiguration = require('../config/googleoauth');

module.exports = (passport) => {
    passport.use(
        new GoogleStrategy({
            clientID: googleOAuthConfiguration.googleClientID,
            clientSecret: googleOAuthConfiguration.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        },
        (accessToken, refreshToken, profile, done) => {
            console.log(accessToken);
            console.log('');
            console.log(profile);
        })
    );
}