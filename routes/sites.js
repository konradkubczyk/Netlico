const express = require('express');
const router = express.Router();

const Auth = require('../utils/auth');

router.get('/', Auth.isAuthorized(), (req, res, next) => {
    res.render('sites', { title: 'Your sites', userEmail: req.user.email, currentUrl: req.originalUrl });
});

module.exports = router;
