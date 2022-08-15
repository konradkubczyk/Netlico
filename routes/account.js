const express = require('express');
const router = express.Router();

const auth = require('../utils/auth');

router.get('/', auth.loggedIn, (req, res, next) => {
    res.send('account');
});

router.get('/login', auth.loggedOut, (req, res, next) => {
    res.render('login');
});

router.get('/register', auth.loggedOut, (req, res, next) => {
    res.render('register');
});

module.exports = router;
