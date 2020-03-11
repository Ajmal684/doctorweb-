const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const Patient = require('../models/Patient');

// console.log(Employee.find({Employee}))
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('login'))


router.post('/dashboard', (req, res) => {
  
  const userid = req.body.userid;
  console.log(userid)
  let data = Patient.find({}, (err, docs) => {
    if (err) {
      return err
    } else if (docs) {
      if (userid) {
        const regex = new RegExp(userid, 'i');

        const matched = docs.filter((val) => {
          return val.user_Id.match(regex)
        });
        return matched
      } else {
        return docs
      }

    }
    res.render('dashboard')
  })
})


// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {

  Patient.find({}, (err, docs) => {
   
    if (err) {
      //do something
    } else {
      res.render('dashboard', {
        user: req.user,
        emp: docs
      })
    }
  })
});


router.get('/update', (req, res) => {
  res.render('update');
  console.log(req.user.email);
});

router.post('/update', (req, res) => {
  console.log(req.body);
  const email = req.user.email;
  const {
    password,
    password2
  } = req.body;
  let errors = [];

  if (!password || !password2) {
    errors.push({
      msg: 'Please enter all fields'
    });
  }

  if (password != password2) {
    errors.push({
      msg: 'Passwords do not match'
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: 'Password must be at least 6 characters'
    });
  }

  if (errors.length > 0) {
    res.render('update', {
      errors,
      password,
      password2
    });
  } else {

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        let newPassword = hash;
        console.log(newPassword, "n");
        User.update({
            email: email
          }, {
            password: newPassword
          })
          .then(user => {
            req.flash(
              'success_msg',
              'Password updated successfully'
            );
            res.redirect('dashboard');

          })
          .catch(err => console.log(err));
      });
    });
  }
});





module.exports = router;