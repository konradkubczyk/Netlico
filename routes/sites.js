const express = require('express');
const router = express.Router();

const Auth = require('../utils/auth');
const User = require('../models/user');
const Site = require('../models/site');

router.get('/', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    await user.read();
    const sites = [];
    for (const siteId of user.sites) {
        const site = new Site(siteId);
        await site.read();
        sites.push(site);
    }
    res.render('sites', { title: 'Your sites', userEmail: req.user.email, currentUrl: req.originalUrl, sites });
});

router.post('/create', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    const newSiteId = await user.createSite();
    res.status(200).json({ siteId: newSiteId });
});

router.delete('/:siteId/delete', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    await user.deleteSite(req.params.siteId);
    res.status(200).json({ success: true });
});

module.exports = router;
