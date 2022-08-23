const express = require('express');
const router = express.Router();

const Auth = require('../utils/auth');

router.get('/', (req, res, next) => {
    const isLoggedIn = Auth.isLoggedIn(req.cookies.authToken);
    res.render('index', { isLoggedIn: isLoggedIn });
});

module.exports = router;
