const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

const Auth = require('../utils/auth');
const User = require('../models/user');
const Site = require('../models/site');
const Page = require('../models/page');

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

router.get('/:siteId', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    await user.read();
    if (user.sites.includes(req.params.siteId)) {
        const site = new Site(req.params.siteId);
        await site.read();

        // Read list of themes data
        const themesDataPath = path.join(__dirname, '../config/themes.json');
        const themes = JSON.parse(fs.readFileSync(themesDataPath));

        res.render('editor', { title: site.title, userEmail: req.user.email, currentUrl: req.originalUrl, site, themes });
    } else {
        res.status(401).render('error', { errorCode: 401, errorMessage: 'Unauthorized' });
    }
});

router.get('/:siteId/preview', Auth.isAuthorized(), async (req, res, next) => {
    res.redirect(`/sites/${req.params.siteId}/0/preview`);
});

router.get('/:siteId/:pageNumber/preview', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    await user.read();

    // Check if the user owns the site
    if (user.sites.includes(req.params.siteId)) {
        const site = new Site(req.params.siteId);
        await site.read();

        // Reads pages of the site
        const pages = [];
        for (const pageNumber of site.pages) {
            const page = new Page(pageNumber);
            await page.read();
            pages.push(page);
        }
        pages.sort((a, b) => a.position - b.position);
        res.render(`themes/${site.theme}`, { site, page: pages[req.params.pageNumber] });
    } else {
        res.status(401).render('error', { errorCode: 401, errorMessage: 'Unauthorized' });
    }
});

router.delete('/:siteId/delete', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    await user.deleteSite(req.params.siteId);
    res.status(200).json({ success: true });
});

router.delete('/:siteId/:pageId/delete', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    await user.deletePage(req.params.siteId, req.params.pageId);
    res.status(200).json({ success: true });
});

router.patch('/:siteId/update', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    await user.read();
    if (user.sites.includes(req.params.siteId)) {
        switch (req.body.entityType) {
            case 'site':
                const site = new Site(req.params.siteId);
                await site.read();
                await site.updateProperty(req.body.property, req.body.value);
                res.status(200).json({ success: true });
                break;
            case 'page':
                const page = new Page(req.body.entityId);
                await page.read();
                if (page.siteId === req.params.siteId) {
                    await page.updateProperty(req.body.property, req.body.value);
                    res.status(200).json({ success: true });
                } else {
                    res.status(401).json({ success: false });
                }
                break;
            default:
                res.status(400).json({ success: false });
        }
    } else {
        res.status(401).json({ success: false });
    }
});

module.exports = router;
