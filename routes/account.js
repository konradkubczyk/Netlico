const express = require('express');
const router = express.Router();

const Auth = require('../utils/auth');
const User = require('../models/user');

// GET /account - Renders account page
router.get('/', Auth.isAuthorized(), (req, res, next) => {
    res.render('account', { title: 'Your account', userEmail: req.user.email, currentUrl: req.originalUrl });
});

// DELETE /account - Deletes user account with all associated data
router.delete('/', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    try {
        const result = await user.delete();
        res.status(result.status).send(result.message);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

// GET /account/login - Renders login page
router.get('/login', Auth.isAuthorized(expectLoggedIn = false, unauthorizedRedirect = '/account'), (req, res, next) => {
    res.render('login');
});

// POST /account/login - Attempts to log in the user, sets a cookie with an authentication token on success and redirects to sites management page
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

// GET /account/register - Renders register page
router.get('/register', Auth.isAuthorized(expectLoggedIn = false, unauthorizedRedirect = '/account'), (req, res, next) => {
    res.render('register');
});

// POST /account/register - Register a new user account
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

// DELETE /account/logout - Logs out the user by deleting the authentication token cookie
router.delete('/logout', Auth.isAuthorized(), (req, res, next) => {
    res.clearCookie('authToken');
    res.send('Logged out successfully');
});

// POST /account/update/email - Updates user's email address
router.post('/update/email', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    try {
        await user.read();
    } catch (error) {
        return res.render('error', { errorCode: error.status, errorMessage: error.message });
    }

    // Check if the new emails match
    if (req.body.newEmail !== req.body.newEmailRepeat) {
        req.flash('error', 'Emails do not match');
        res.status(400).redirect('/account');

        // Check if the new email is different from the old one
    } else if (req.body.newEmail === user.email) {
        req.flash('error', 'New email is the same as the old one');
        res.status(400).redirect('/account');
    } else {
        try {
            // Check provided password
            const authToken = await User.verify(user.email, req.body.currentPassword);

            // Update email
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

// POST /account/update/password - Updates user's email password
router.post('/update/password', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    try {
        await user.read();
    } catch (error) {
        return res.render('error', { errorCode: error.status, errorMessage: error.message });
    }

    // Check if new passwords match
    if (req.body.newPassword !== req.body.newPasswordRepeat) {
        req.flash('error', 'Passwords do not match');
        res.status(400).redirect('/account');

        // Check if the new password is the same as the old one provided by the user
    } else if (req.body.newPassword === req.body.currentPassword) {
        req.flash('error', 'New and current passwords must be different');
        res.status(400).redirect('/account');
    } else {
        try {
            // Verify current password provided by the user
            await User.verify(user.email, req.body.currentPassword);

            // Update password
            try {
                const hashedPassword = await User.hashPassword(req.body.newPassword);
                await user.updateProperty('hashedPassword', hashedPassword);

                // Log out on password change
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
