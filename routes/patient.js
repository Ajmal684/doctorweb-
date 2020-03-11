const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//Load Employee model
const Patient = require('../models/Patient');
const { forwardAuthenticated } = require('../config/auth');

//new page
router.get('/add', (req, res) => res.render('patient'));

//emp page
router.post('/add', (req, res) => {
  let nextId = null;
  const { name, mobile, age, location, description, email } = req.body;
  let errors = [];

  if (!name || !mobile || !age || !location || !description) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.render('patient', {
      errors,
      name,
      age,
      location,
      mobile,
      description
    });
  } else {

    Patient.find().sort({ _id: -1 }).limit(3).exec(function (err, doc) {
      if ((!err || err == null) && doc.length > 0) {
        doc = doc.sort((a, b) => {
          return parseInt(b['user_Id'].substring(3)) - parseInt(a['user_Id'].substring(3));
        })
        //first 3 characters indicate which schema it's from
        //DOC for DoctorSchema, SAA for SanarAdminSchema etc
        nextId = parseInt((doc[0]['user_Id']).substring(3)) + 1;

      } else if ((!err || err == null) && doc.length == 0) {
        nextId = 1;
      }
    });

    Patient.findOne({ description:"1" }).then(user => {
      if (user) {
        errors.push({ msg: 'description already exists' });
        res.render('patient', {
          errors,
          name,
          email,
          age,
          location,
          mobile,
          description
        });
      } else {
        const newPatient = new Patient({
          name,
          email,
          email,
          age,
          location,
          mobile,
          description
        });
        newPatient.user_Id = nextId ? "PAT" + nextId : undefined;
        newPatient.save()
          .then(user => {
            req.flash(
              'success_msg',
              `Patient added successfully and user id : ${newPatient.user_Id}`
            );
            res.redirect('/dashboard');
          })
          .catch(err => console.log(err));
      }
    });
  }
});

// search page get
router.get('/view/:id', (req, res) => {
 // console.log(req.params.id)
  user_Id =req.params.id;
  Patient.findOne({ user_Id: user_Id}, (err, result) => {
  //  console.log(result.name)
    if(err){

    }else{
      res.render('view', {
        emp: result
      })
    }
  })

});


// search page post

router.post('/update', (req, res) => {
  

})


module.exports = router;