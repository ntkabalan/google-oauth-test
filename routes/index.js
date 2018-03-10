const express = require('express');

const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

const Story = require('../models/Story');

const router = express.Router();

// Welcome page
router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome');
});

// User dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Story.find({ user: req.user }).then(stories => {
        res.render('index/dashboard', {
            stories: stories
        });
    });
});

// About page
router.get('/about', (req, res) => {
    res.render('index/about');
});

module.exports = router;