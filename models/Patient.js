const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({ 
 
  user_Id: {
      type: String,
      required: true,
      unique: true
  }, 
  name: {
    type: String,
    required: true
  },
  age:{
    type: String,
    required: true
  },
  location:{
    type:String,
    required: true
  },
  email: {
    type: String
    
  },
  mobile: {
    type: String,
    required:true
  },
  description:{
    type: String,
    required:true
  },
  date: {
    type: Date,
    default: Date.now
  }
});


const Patient = mongoose.model('Patient', PatientSchema);

module.exports = Patient;
