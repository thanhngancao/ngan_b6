const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Homepage Page
router.get('/', forwardAuthenticated, (req, res) => res.render('homepage'));
router.get('/users/comment', ensureAuthenticated, (req,res) => res.render('comment'));

// Swit Page
router.get('/logout', ensureAuthenticated, (req, res) =>
  res.render('logout', {
    user: req.user.name
  })
);

module.exports = router;