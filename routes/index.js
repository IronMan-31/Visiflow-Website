const express = require('express');
const router = express.Router();

// Middleware to check if user is authenticated
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error', 'Please log in to view this page');
    res.redirect('/login');
  }
};

// Middleware to check if user is not authenticated
const ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
  } else {
    return next();
  }
};

// Home page
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
  } else {
    res.render('index', {
      title: 'River Monitoring - Home'
    });
  }
});

// Login page
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  res.render('login', {
    title: 'Login - River Monitoring'
  });
});

// Signup page
router.get('/signup', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  res.render('signup', {
    title: 'Sign Up - River Monitoring'
  });
});

// Dashboard page (protected)
router.get('/dashboard', ensureAuth, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard - River Monitoring',
    user: req.user
  });
});

module.exports = router;