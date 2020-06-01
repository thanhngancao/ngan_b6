const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const Comment = require('../models/Comment');


const { forwardAuthenticated,ensureAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

//Commit Page
router.get('/comment', ensureAuthenticated, (req, res) => res.render('comment'));

router.get('/review', (req, res) => res.render('ListComment'));
// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/logout',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg');
  res.redirect('/users/login');
});

// Comment
// router.post('/comment', (req, res) => {
//   const { email, comment } = req.body;
//   let errors = [];

//   if (!email || !comment) {
//     errors.push({ msg: 'Please enter all fields' });
//   }

//   if (comment.length > 3) {
//     errors.push({ msg: 'You should comment at least 4 characters' });
//   }

//   if (errors.length > 0) {
//     res.render('comment', {
//       errors,
//       email,
//       comment
//     });
//   } else {
//     bcrypt.genSalt(10, (err, salt) => {
//       bcrypt.hash(newUser.password, salt, (err, hash) => {
//         if (err) throw err;
//           newUser.password = hash;
//             newUser
//               .save()
//               .then(user => {
//                 req.flash(
//                   'success_msg',
//                   'Your comments are send successfully. You can see that in list comment'
//                 );
//                 res.redirect('/users/listcomment');
//               })
//               .catch(err => console.log(err));
//           });
//         });
//   }
// });
router.post('/comment', (req, res) => {
  console.log(req.body);
  const today = new Date();
  const {email,comment} = req.body;
  const newcomment = new Comment(
    {
        email:email,
        comment:comment,
        date:today
    }
    );
    try {
        const savecomment = newcomment.save();
    } catch (err) {
        res.json({ message: err })
    }
    res.redirect('/logout');
  }
)

// router.get('/review', function(req,res,next) {
//   MongoClient.connect(url, function(err,db){
//     if(err) throw err;
//     var dbo = db.db("b6");
//     dbo.collection("comments").find({}).toArray(function(err,result){
//       if (err) throw err;
//       res.send(result);
//       db.close();
//     });
//   });
// });

// router.get('/review', function(req, res, next) {
//   Comment.find()
//     .then(comments => {
//       res.render('Listcomment', {
//         prods: comments, 
//         path: '/review'
//         }
//       )
//     }
//   )
// })

module.exports = router;