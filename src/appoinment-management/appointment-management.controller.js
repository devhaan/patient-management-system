const Appointment = require("./appoinment-management.entity");
var ObjectId = require("mongodb").ObjectId;

// Book an appointment (Patients can book with Doctors)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, patientId } = req.body;

    if (!doctorId)
      return res.status(400).json({ message: "Doctor ID not found" });

    if (!appointmentDate)
      return res.status(400).json({ message: "Appointment Date not found" });

    let appointment;

    if (req.user.role === "Patient") {
      appointment = new Appointment({
        patientId: new ObjectId(req.user.userId),
        doctorId: new ObjectId(doctorId),
        appointmentDate,
      });
    } else if (req.user.role === "Admin") {
      if (!patientId)
        return res.status(400).json({ message: "Patient ID not found" });

      appointment = new Appointment({
        patientId: new ObjectId(patientId),
        doctorId: new ObjectId(doctorId),
        appointmentDate,
      });
    }

    await appointment.save();
    res.status(201).json({ appointment });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "An error occurred while booking the appointment" });
  }
};

// Read appointment (Patients can read their own, Doctors can read their own appointments)
exports.getAppointment = async (req, res) => {
  try {
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

    if (!appointment || appointment.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ appointment });
  } catch (error) {
    console.error("Error retrieving appointment:", error);
    res.status(500).json({ message: "An error occurred while retrieving the appointment" });
  }
};

// Update appointment (Doctors can update their appointments, Admins can update all)
exports.updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    if (!appointmentId)
      return res.status(400).json({ message: "Appointment ID not found" });

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
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "An error occurred while updating the appointment" });
  }
};

// Delete appointment (Admins can delete any appointment)
exports.deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    if (!appointmentId)
      return res.status(400).json({ message: "Appointment ID not found" });

    const appointment = await Appointment.findOne(appointmentId);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (req.user.userId !== appointment.patientId.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await appointment.deleteOne();
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "An error occurred while deleting the appointment" });
  }
};
