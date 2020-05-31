const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Homepage Page
router.get('/', forwardAuthenticated, (req, res) => res.render('homepage'));

// Swit Page
router.get('/logout', ensureAuthenticated, (req, res) =>
  res.render('logout', {
    user: req.user.name
  })
);

module.exports = router;