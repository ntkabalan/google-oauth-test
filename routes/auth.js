const express = require('express');
const passport = require('passport');

const router = express.Router();

// Google OAuth get route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
	passport.authenticate( 'google', {
		successRedirect: '/dashboard',
		failureRedirect: '/'
	}));

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.get('/verify', (req, res) => {
	if (req.user) {
		console.log(req.user);
	} else {
		console.log('Not authenticated...');
	}
});

module.exports = router;