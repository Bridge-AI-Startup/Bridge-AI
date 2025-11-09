const express = require('express');
const router = express.Router();
const { addToWaitlist, getWaitlistStats } = require('../controllers/waitlistController');

// Public route - anyone can join waitlist
router.post('/', addToWaitlist);

// Stats route - should add auth middleware later
router.get('/stats', getWaitlistStats);

module.exports = router;
