const express = require('express');
const router = express.Router();

const Auth = require('../utils/auth');
const User = require('../utils/user');

router.get('/', Auth.isAuthorized(), (req, res, next) => {
    // res.send('account');
    res.send(req.user);
});

router.get('/login', Auth.isAuthorized(expectLoggedIn = false, unauthorizedRedirect = '/account'), (req, res, next) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    try {
        const authToken = await User.logIn(req.body.email, req.body.password);
        
        res.cookie("authToken", authToken, {
            httpOnly: true,
            sameSite: true,
            secure: process.env.NODE_ENV === "production"
        }).status(200).redirect('/');
    } catch (error) {
        req.flash('error', error.message);
        res.status(error.status).redirect('/account/login');
    }
});

router.get('/register', Auth.isAuthorized(expectLoggedIn = false, unauthorizedRedirect = '/account'), (req, res, next) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const result = await User.register(req.body.email, req.body.password);
        req.flash('success', result.message);
        res.status(result.status).redirect('/account/register');
    } catch (error) {
        req.flash('error', error.message);
        res.status(error.status).redirect('/account/register');
    }
});

router.delete('/logout', Auth.isAuthorized(), (req, res, next) => {
    // TODO: Implement logout
    res.send('Not yet implemented');
});

module.exports = router;
