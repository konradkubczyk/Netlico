const express = require('express');
const router = express.Router();

const Auth = require('../utils/auth');
const Site = require('../models/site');

router.get('/:path?', async (req, res, next) => {
    if (req.subdomains.length) {
        const site = await Site.findBySubdomain(req.subdomains[0]);
        if (site) {
            site.render(res, null, req.params.path);
        } else {
            // Get main domain without the subdomain
            const domain = req.get('host').split('.').slice(1).join('.');
            res.redirect(`https://${domain}`);
        }
    } else {
        const isLoggedIn = Auth.isLoggedIn(req.cookies.authToken);
        res.render('index', { isLoggedIn: isLoggedIn });
    }
});

module.exports = router;
