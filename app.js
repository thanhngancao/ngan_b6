const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

const mongoURI = 'mongodb+srv://b6:y6bVkAtNvFsbKOeo@cluster0-xcap6.gcp.mongodb.net/b6?retryWrites=true&w=majority'
// Connect to MongoDB
// mongoose
//   .connect(
//     db,
//     { useNewUrlParser: true }
//   )
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

mongoose
  .connect(mongoURI,{
    useNewUrlParser: true, 
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(result => {
    console.log('server run!');
    app.listen(process.env.store || 1212);
  })
  .catch(err => {
    console.log(err);
  });

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
//Connect CSS
app.use(express.static(path.join(__dirname,'public')));
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, console.log(`Server started on port ${PORT}`));

