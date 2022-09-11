const express = require('express');
const router = express.Router();

const Auth = require('../utils/auth');
const Site = require('../models/site');
const Page = require('../models/page');

router.get('/:path', async (req, res, next) => {
    if (req.subdomains.length) {
        const site = await Site.findBySubdomain(req.subdomains[0]);
        site.render(res, null, req.params.path);
    } else {
        next();
    }
});

router.get('/', async (req, res, next) => {
    if (req.subdomains.length) {
        const site = await Site.findBySubdomain(req.subdomains[0]);
        site.render(res, null, req.params.path);
    } else {
        const isLoggedIn = Auth.isLoggedIn(req.cookies.authToken);
        res.render('index', { isLoggedIn: isLoggedIn });
    }
});

module.exports = router;
