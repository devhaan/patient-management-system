const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  appointmentDate: Date,
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
