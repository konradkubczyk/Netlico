const express = require('express');
const router = express.Router();

const Auth = require('../utils/auth');
const User = require('../models/user');

router.get('/', Auth.isAuthorized(), (req, res, next) => {
    res.render('account', { title: 'Your account', userEmail: req.user.email, currentUrl: req.originalUrl });
});

router.delete('/', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    try {
        const result = await user.delete();
        res.status(result.status).send(result.message);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

router.get('/login', Auth.isAuthorized(expectLoggedIn = false, unauthorizedRedirect = '/account'), (req, res, next) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    try {
        const authToken = await User.verify(req.body.email, req.body.password);
        
        res.cookie('authToken', authToken, {
            httpOnly: true,
            sameSite: true,
            secure: process.env.NODE_ENV === "production"
        }).status(200).redirect('/sites');
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
        const result = await User.create(req.body.email, req.body.password);
        req.flash('success', result.message);
        res.status(result.status).redirect('/account/register');
    } catch (error) {
        req.flash('error', error.message);
        res.status(error.status).redirect('/account/register');
    }
});

router.delete('/logout', Auth.isAuthorized(), (req, res, next) => {
    res.clearCookie('authToken');
    res.send('Logged out successfully');
});

router.post('/update/email', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    await user.read();

    if (req.body.newEmail !== req.body.newEmailRepeat) {
        req.flash('error', 'Emails do not match');
        res.status(400).redirect('/account');
    } else if (req.body.newEmail === user.email) {
        req.flash('error', 'New email is the same as the old one');
        res.status(400).redirect('/account');
    } else {
        try {
            const authToken = await User.verify(user.email, req.body.currentPassword);
            try {
                await user.updateProperty('email', req.body.newEmail);
                res.clearCookie('authToken').status(200).redirect('/account');
            } catch (error) {
                req.flash('error', 'Could not update email');
                res.status(error.status).redirect('/account');
            }
        } catch (error) {
            req.flash('error', error.message);
            res.status(500).redirect('/account');
        }
    }
});

router.post('/update/password', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    await user.read();

    if (req.body.newPassword !== req.body.newPasswordRepeat) {
        req.flash('error', 'Passwords do not match');
        res.status(400).redirect('/account');
    } else if (req.body.newPassword === req.body.currentPassword) {
        req.flash('error', 'New and current passwords must be different');
        res.status(400).redirect('/account');
    } else {
        try {
            await User.verify(user.email, req.body.currentPassword);
            try {
                const hashedPassword = await User.hashPassword(req.body.newPassword);
                await user.updateProperty('hashedPassword', hashedPassword);
                res.clearCookie('authToken').status(200).redirect('/account');
            } catch (error) {
                req.flash('error', 'Could not update password');
                res.status(error.status).redirect('/account');
            }
        } catch (error) {
            req.flash('error', error.message);
            res.status(500).redirect('/account');
        }
    }
});

module.exports = router;
