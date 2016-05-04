'use strict'

var LocalStrategy   = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var passport    = require('passport')

module.exports = function(app) {
    var orm_account = app.database.db0.account;

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log('serializeUser', user);
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(_id, done) {
        orm_account.findOneById(null, _id)
        .then(user=>done(null, user))
        .fail(done)
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses email and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : false // allows us to pass back the entire request to the callback
        },
        function(email, password, done) { // callback with email and password from our form
            orm_account.findOne(null, {email})
            .then(user=>{
                console.log('local-login', user);
                if(user)
                    if(user.authenticate(password))
                        return _.pick(user, '_id', 'name', 'email');
                    else
                        throw {message: 'Wrong password.'};
                else
                    throw {message: 'No email found.'};
            })
            .then(user=>done(null, user))
            .fail(err=>done(null, false, err))
        })
    );
};
