const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//Load Employee model
const Employee = require('../models/emp');
const { forwardAuthenticated } = require('../config/auth');

//new page
router.get('/new', (req, res) => res.render('employee'));

//emp page
router.post('/new', (req,res) => {
    const { name, email, password } = req.body;
    let errors = [];
  
    if (!name || !email || !password) {
      errors.push({ msg: 'Please enter all fields' });
    }

    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('employee', {
        errors,
        name,
        email,
        password
      });
    } else {
        Employee.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('employee', {
            errors,
            name,
            email,
            password
          });
        } else {
          const newEmp = new Employee({
            name,
            email,
            password
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newEmp.password, salt, (err, hash) => {
              if (err) throw err;
              newEmp.password = hash;
              newEmp
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'Employee added successfully'
                  );
                  res.redirect('/dashboard');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }


});


module.exports = router;

