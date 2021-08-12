const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// To get the signup form
router.get('/register', (req, res) => {
    res.render('auth/signup');
});


// Registering the user
router.post('/register', async (req, res) => {
    // console.log(req.body);
    // res.send("It worked");
    try {
        const user = {
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,
            username:req.body.username
        }

        //  register user
        const newUser = await User.register(user, req.body.password);
        // send the user details
        // res.status(200).send(newUser);  // status(200) -> response is success
        req.flash("success","Registered Successfully,Please Login to continue")
        res.redirect('/login');
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('/register');
    }
});

// To get the login page
router.get('/login', (req, res) => {
    // console.log(req.body);
    res.render('auth/login');
});

// Login the user
router.post('/login', passport.authenticate('local',
    {
        failureRedirect: '/login',
        failureFlash:true
    }), async (req, res) => {
        // after successful login redirect to tweet
        res.redirect('/tweet');
});

// To get the tweet page
router.get('/tweet', (req, res) => {
    // console.log(req.body);
    res.render('layouts/home');
});

// To get the tweet page
router.get('/list', (req, res) => {
    // console.log(req.body);
    res.render('layouts/list');
});


// Logout
router.get('/logout', (req, res) => {
    req.logout();
    // after successful logout redirect to home
    res.redirect('/');
});


module.exports = router;