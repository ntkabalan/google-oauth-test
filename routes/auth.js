const express = require('express');
const passport = require('passport');

const router = express.Router();

// Google OAuth get route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get( '/google/callback',
	passport.authenticate( 'google', {
		successRedirect: '/dashboard',
		failureRedirect: '/'
}));

module.exports = router;