const express = require('express');
const router = express.Router();

const Auth = require('../utils/auth');
const Site = require('../models/site');

// GET / - Renders home page or a site if accessing the app from an active subdomain
router.get('/:path?', async (req, res, next) => {
    // Check if the user is accessing the app from a subdomain
    if (req.subdomains.length) {
        // Find the site associated with the subdomain if one exists
        const site = await Site.findBySubdomain(req.subdomains[0]);

        if (site) {
            site.render(res, null, req.params.path);
        } else {
            // Redirect to the main domain if there is no site associated with the subdomain
            const domain = req.get('host').split('.').slice(1).join('.');
            res.redirect(`https://${domain}`);
        }
    } else if (!req.params.path) {
        // Render the home page if the user is accessing the app from the main domain and no path is specified
        const isLoggedIn = Auth.isLoggedIn(req.cookies.authToken);
        res.render('index', { isLoggedIn: isLoggedIn });
    } else {
        // Continue to the next middleware if the user is accessing the app from the main domain and a path is specified
        next();
    }
});

module.exports = router;
