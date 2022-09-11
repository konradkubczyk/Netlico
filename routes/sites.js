const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

const Auth = require('../utils/auth');
const User = require('../models/user');
const Site = require('../models/site');
const Page = require('../models/page');

// GET /sites - Renders sites management page
router.get('/', Auth.isAuthorized(), async (req, res, next) => {
    // Read user data
    const user = new User(req.user.id);
    await user.read();

    // Get all sites of the current user
    const sites = [];
    for (const siteId of user.sites) {
        const site = new Site(siteId);
        await site.read();
        sites.push(site);
    }

    // Get current domain of the app (with optional port)
    const appDomain = req.get('host');

    res.render('sites', { title: 'Your sites', userEmail: req.user.email, currentUrl: req.originalUrl, sites, appDomain });
});

// POST /sites/create - Creates a new site
router.post('/create', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    const newSiteId = await user.createSite();
    res.status(200).json({ siteId: newSiteId });
});

// GET /sites/:siteId - Renders the site editor
router.get('/:siteId', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    await user.read();
    
    // Check if the user is authorized to edit the site
    if (user.sites.includes(req.params.siteId)) {
        const site = new Site(req.params.siteId);
        await site.read();

        // Read all pages of the site
        const pages = [];
        for (const pageId of site.pages) {
            const page = new Page(pageId);
            await page.read();
            pages.push(page);
        }
        pages.sort((a, b) => a.position - b.position);

        // Read list of themes data
        const themesDataPath = path.join(__dirname, '../config/themes.json');
        const themes = JSON.parse(fs.readFileSync(themesDataPath));

        // Get current domain of the app (with optional port)
        const appDomain = req.get('host');

        res.render('editor', { title: site.title, userEmail: req.user.email, currentUrl: req.originalUrl, site, pages, themes, appDomain });
    } else {
        res.status(401).render('error', { errorCode: 401, errorMessage: 'Unauthorized' });
    }
});

// GET /sites/:siteId/preview - Redirect to the preview of the main page of the site
router.get('/:siteId/preview', Auth.isAuthorized(), async (req, res, next) => {
    res.redirect(`/sites/${req.params.siteId}/0/preview`);
});

// GET /sites/:siteId/:pageNumber/preview - Renders the given site page's preview
router.get('/:siteId/:pageNumber/preview', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    await user.read();

    const site = new Site(req.params.siteId);
    site.render(res, user, null, true, req.params.pageNumber);
});

// DELETE /sites/:siteId/delete - Deletes the site and all associated pages or a page
router.delete('/:siteId/delete', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);

    switch (req.body.entityType) {
        case 'site':
            await user.deleteSite(req.body.entityId);
            res.status(200).json({ message: 'Site deleted' });
            break;
        case 'page':
            await user.deletePage(req.params.siteId, req.body.entityId);
            res.status(200).json({ message: 'Page deleted' });
            break;
        default:
            res.status(400).json({ message: 'Invalid entity type' });
            return;
    }
});

// POST /sites/:siteId/create-page - Creates a new page and adds it to the site
router.post('/:siteId/create-page', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    await user.read();

    // Check if the user is authorized to edit the site
    if (user.sites.includes(req.params.siteId)) {
        const site = new Site(req.params.siteId);
        await site.createPage();
        res.status(200).json({ success: true });
    } else {
        res.status(401).render('error', { errorCode: 401, errorMessage: 'Unauthorized' });
    }
});

// PATCH /sites/:siteID/update - Updates a user-modifiable property of a site/page
router.patch('/:siteId/update', Auth.isAuthorized(), async (req, res, next) => {
    const user = new User(req.user.id);
    await user.read();

    // Check if the user is authorized to edit the site
    if (user.sites.includes(req.params.siteId)) {
        let modifiableProperties = [];
        switch (req.body.entityType) {
            case 'site':
                // List of user-modifiable site properties
                modifiableProperties = ['language', 'title', 'description', 'theme', 'subdomain', 'isPublished', 'customDomain'];

                if (modifiableProperties.includes(req.body.property)) {
                    const site = new Site(req.params.siteId);
                    await site.read();

                    // Normalize the value of the property
                    let newValue = req.body.value;
                    if (req.body.property === 'isPublished') {
                        newValue = newValue === 'true';
                    } else if (req.body.property === 'subdomain') {
                        newValue = newValue.toLowerCase();
                        newValue = newValue.replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
                    } else if (['language', 'title', 'description'].includes(req.body.property)) {
                        newValue = newValue.replace(/<script.*?>.*?<\/script>/g, '');
                    }

                    try {
                        await site.updateProperty(req.body.property, newValue);
                        res.status(200).json({ success: true });
                    } catch (error) {
                        res.status(400).json({ success: false });
                    }
                    
                } else {
                    res.status(400).json({ message: 'Invalid property' });
                }

                break;
            case 'page':
                // List of user-modifiable page properties
                modifiableProperties = ['title', 'position', 'content', 'path'];

                if (modifiableProperties.includes(req.body.property)) {
                    const page = new Page(req.body.entityId);
                    await page.read();

                    // Check if the page belongs to the site
                    if (page.site == req.params.siteId) {
                        // Normalize the value of the property
                        let newValue = req.body.value;
                        if (req.body.property === 'path') {
                            newValue = newValue.toLowerCase();
                            newValue = newValue.replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
                        } else if (['title', 'content'].includes(req.body.property)) {
                            newValue = newValue.replace(/<script.*?>.*?<\/script>/g, '');
                        }

                        try {
                            await page.updateProperty(req.body.property, newValue);
                            res.status(200).json({ success: true });
                        } catch (error) {
                            res.status(400).json({ success: false });
                        }
                    } else {
                        res.status(401).json({ success: false });
                    }
                } else {
                    res.status(400).json({ message: 'Invalid property' });
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
