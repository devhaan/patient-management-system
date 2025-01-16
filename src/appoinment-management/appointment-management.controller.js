const Appointment = require("./appoinment-management.entity");

// Book an appointment (Patients can book with Doctors)
exports.bookAppointment = async (req, res) => {
  const { doctorId, appointmentDate, patientId } = req.body;

  if (!doctorId)
    return res.status(404).json({ message: "Doctor ID not found" });

  if (!appointmentDate)
    return res.status(404).json({ message: "Appointment Date not found" });

  let appointment;

  if ((req.user.role = "Patient")) {
    appointment = new Appointment({
      patientId: new Object(req.user.userId),
      doctorId: new Object(doctorId),
      appointmentDate,
    });
  } else if ((req.user.role = "Admin")) {

    if (!patientId)
      return res.status(404).json({ message: "Patient ID not found" });

    appointment = new Appointment({
      patientId: new Object(patientId),
      doctorId: new Object(doctorId),
      appointmentDate,
    });
  }

  await appointment.save();
  res.status(201).json({ appointment });
};

// Read appointment (Patients can read their own, Doctors can read their own appointments)
exports.getAppointment = async (req, res) => {

  let appointment;

  // Access control
  if (req.user.role === "Patient") {
    appointment = await Appointment.find({ patientId: req.user.userId });
  }

  if (req.user.role === "Doctor") {
    appointment = await Appointment.find({ doctorId: req.user.userId });
  }

  if (req.user.role === "Admin") {
    appointment = await Appointment.find();
  }

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  res.json({ appointment });
};

// Update appointment (Doctors can update their appointments, Admins can update all)
exports.updateAppointment = async (req, res) => {
  const appointmentId = req.params.id;

  if (!appointmentId)
    return res.status(404).json({ message: "AppointmentId not found" });

  const appointment = await Appointment.findOne(appointmentId);

  if (!appointment)
    return res.status(404).json({ message: "Appointment not found" });

  // Access control
  if (
    req.user.role === "Patient" &&
    appointment.patientId.toString() !== req.user.userId
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (
    req.user.role === "Doctor" &&
    appointment.doctorId.toString() !== req.user.userId
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.body.status) appointment.status = req.body.status;
  if (req.body.appointmentDate)
    appointment.appointmentDate = req.body.appointmentDate;

  await appointment.save();

  res.json({ appointment });
};

// Delete appointment (Admins can delete any appointment)
exports.deleteAppointment = async (req, res) => {
  const appointmentId = req.params.id;

  if (!appointmentId)
    return res.status(404).json({ message: "AppointmentId not found" });

  const appointment = await Appointment.findOne(appointmentId);

  if (!appointment)
    return res.status(404).json({ message: "Appointment not found" });

  if (req.user.userId !== appointment.patientId.toString()) {
    return res.status(404).json({ message: "Forbidden" });
  }

  await appointment.deleteOne(appointmentId);
  res.status(204).end();
};
