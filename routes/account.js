const express = require('express');
const router = express.Router();

const Auth = require('../utils/auth');

router.get('/', Auth.isAuthorized(), (req, res, next) => {
    // res.send('account');
    res.send(req.user);
});

router.get('/login', Auth.isAuthorized(expectLoggedIn = false, unauthorizedRedirect = '/account'), (req, res, next) => {
    res.render('login');
});

router.get('/register', Auth.isAuthorized(expectLoggedIn = false, unauthorizedRedirect = '/account'), (req, res, next) => {
    res.render('register');
});

router.delete('/logout', Auth.isAuthorized(), (req, res, next) => {
    // TODO: Implement logout
    res.send('Not yet implemented');
});

module.exports = router;
