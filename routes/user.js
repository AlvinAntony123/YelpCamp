const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const user = require('../controllers/users');

router.route('/register')
    .get(user.registerNew)
    .post(user.registerCreate)

router.route('/login')
    .get(user.login)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginAuth)

router.get('/logout', user.logout)

module.exports = router;