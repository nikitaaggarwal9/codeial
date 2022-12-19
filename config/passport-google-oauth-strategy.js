const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: "1097024981495-s73070v7ipv2d7nk25c2jt69ofgbufka.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback",
    }, 
    function(accessToken, refreshToken, profile, done) {
        // find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user) {
            if(err) {console.log('error in google strategy-passport', err); return;}

            console.log(profile);
            if(user) {
                // if found, set this as req.user (i.e. sign in)
                return done(null, user);
            } else {
                // if not fount, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user) {
                    if(err) {console.log('error in createing user google strategy-passport', err); return;}

                    return done(null, user);
                })
            }
        });
    }
))