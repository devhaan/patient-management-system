const mongoose = require('mongoose');
const { Schema } = mongoose;

const PatientSchema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true // Ensures one-to-one relationship between User and Patient
  },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  contactInfo: {
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  medicalHistory: { 
    type: String, 
    default: '' 
  },
  assignedDoctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false // Optional, as not all patients may have an assigned doctor
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true // Ensures one-to-one relationship between User and Patient
  },
});

module.exports = mongoose.model('Patient', PatientSchema);
