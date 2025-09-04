const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const flash = require('express-flash');
const methodOverride = require('method-override');
require('dotenv').config();
let PORT = 3000
const app = express();

// Database connection
require('./config/database');

// Passport configuration
require('./config/passport')(passport);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', './views');

// Static files
app.use(express.static('public'));

// Body parsing middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));


app.get("/about", (req, res) => {
  res.render("about", { title: "About Us" });
});

app.get("/addmachine", (req, res) => {
  res.render("add_machine", { title: "Add Mahine" });
});

app.get("/view_machine", (req, res) => {
  res.render("view_machine", { title: "View Machine" });
});

app.get("/real_time", (req, res) => {
  res.render("real_time", { title: "Real - Time Data" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
