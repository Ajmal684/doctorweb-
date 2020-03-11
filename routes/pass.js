const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require('nodemailer');
const generator = require('generate-password');
// Load User model
const User = require('../models/User');



var newPassword = generator.generate({
    length: 10,
    numbers: true
});


router.get('/', (req, res) => {
    res.render('pass');
});

router.get('/reset', (req, res) => {
    res.render('reset');
});


router.post('/checkUser', (req, res) => {
    const email = req.body.email;
    console.log(req.body)
    let errors = [];

    if (!email) {
        errors.push({ msg: 'please enter  email' })
    }
    // if (!password || !password2) {
    //     errors.push({ msg: 'Please enter all fields' });
    // }

    // if (password != password2) {
    //     errors.push({ msg: 'Passwords do not match' });
    // }

    // if (password.length < 6) {
    //     errors.push({ msg: 'Password must be at least 6 characters' });
    // }

    // if(password === User.password){
    //     errors.push({ msg: 'eeeeeeeeeee'});
    // }

    if (errors.length > 0) {
        res.render('pass', {
            errors,
            email
            // password,
            // password2
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'ajmalmkmna@gmail.com',
                      pass: 'ajmal684*'
                    }
                  });
                  
                  var mailOptions = {
                    from: 'ajmalmkmna@gmail.com',
                    to: email,
                    subject: 'Reset Password',
                    text: `Your New Password  :- ${newPassword}.`,
                //  html: `<h3>Your New Password</h3><p>${newPassword}</p>
                //         <p><a href="http://localhost:4013/users/login">link</a>`        
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                      errors.push({ msg: 'please enter valid email' });
                    } else {
                      console.log('Email sent: ' + info.response);
                    } 
                  });
                  res.redirect('/users/login');

                // if (!password || !password2) {
                //     errors.push({ msg: 'Please enter all fields' });
                // }

                // if (password != password2) {
                //     errors.push({ msg: 'Passwords do not match' });
                // }

                // if (password.length < 6) {
                //     errors.push({ msg: 'Password must be at least 6 characters' });
                // }

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newPassword, salt, (err, hash) => {
                        if (err) throw err;
                       let newPassword = hash;
                       console.log(newPassword, "n");
                       console.log(user.email, 'em');
                        User.update({ email: user.email }, {password: newPassword})
                            .then(user => { 
                                req.flash(
                                    'success_msg',
                                    'Password updated successfully'
                                );
                                res.redirect('/users/login');

                            })
                            .catch(err => console.log(err)); 
                    });
                });


           } else {
                errors.push({ msg: 'please enter valid email' })
            }
        })
            .catch(err => console.log(err));
    }
});


router.get('/reset',(req,res) => {
    res.render('reset')
});

module.exports = router;