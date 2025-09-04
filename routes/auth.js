const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Local signup
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  let errors = [];

  // Validation
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  if (password !== confirmPassword) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password && password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    req.flash('error', errors.map(error => error.msg));
    return res.redirect('/signup');
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      req.flash('error', 'User with that email already exists');
      return res.redirect('/signup');
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      provider: 'local'
    });

    await newUser.save();
    
    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
  } catch (error) {
    console.error('Signup error:', error);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/signup');
  }
});

// Local login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    req.flash('success', `Welcome back, ${req.user.firstName}!`);
    res.redirect('/dashboard');
  }
);

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return next(err);
    }
    req.flash('success', 'You have been logged out successfully');
    res.redirect('/');
  });
});

module.exports = router;