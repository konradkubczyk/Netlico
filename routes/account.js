const express = require('express');
const router = express.Router();

const auth = require('../services/auth');

router.get('/', auth, (req, res, next) => {
    res.send('account');
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

module.exports = router;
