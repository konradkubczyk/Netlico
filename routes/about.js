const express = require('express');
const router = express.Router();

const fs = require('fs');

// GET /about/licenses - Renders licenses page
router.get('/licenses', (req, res, next) => {
    // Load licenses from file
    const licenses = JSON.parse(fs.readFileSync('licenses.json', 'utf8'));
    const licensesArray = Object.keys(licenses).map(key => licenses[key]);

    res.render('licenses', { licenses: licensesArray });
});

module.exports = router;
