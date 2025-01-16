const Patient = require("./patient-management-entity");
const User = require("../user-management/user-management-entity");
var ObjectId = require("mongodb").ObjectId;

// Create patient record (Doctors and Admins)
exports.createPatient = async (req, res) => {
  try {
    const { age, userId, gender, contactInfo, medicalHistory, assignedDoctor } = req.body;

    if (
      !age ||
      !userId ||
      !gender ||
      !contactInfo ||
      !medicalHistory ||
      !assignedDoctor
    ) {
      return res.status(400).json({
        message:
          "Required fields: age, userId, gender, contactInfo, medicalHistory, assignedDoctor",
      });
    }

    const patient = new Patient({
      age,
      medicalHistory,
      gender,
      contactInfo,
      assignedDoctor: new ObjectId(assignedDoctor),
      userId: new ObjectId(userId),
      createdBy: req.user.userId, // Patient created by the current user
    });

    await patient.save();
    res.status(201).json({ patient });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ message: "An error occurred while creating the patient" });
  }
};

// Read patient record (Patients can read their own, Doctors/Admins can read all)
exports.getPatient = async (req, res) => {
  try {
    let patient;
    if (req.user.role == "Admin") {
      patient = await Patient.find();
    } else if (req.user.role == "Doctor") {
      patient = await Patient.find({ assignedDoctor: req.user.userId });
    } else {
      patient = await Patient.find({ userId: req.user.userId });
    }

    if (!patient || patient.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ patient });
  } catch (error) {
    console.error("Error retrieving patient:", error);
    res.status(500).json({ message: "An error occurred while retrieving the patient" });
  }
};

// Update patient record (Doctors can update their patients, Admins can update all)
exports.updatePatient = async (req, res) => {
  try {
    const patientId = req.params.id;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID not found" });
    }

    const patient = await Patient.findOne(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (
      req.user.role === "Doctor" &&
      patient.assignedDoctor.toString() !== req.user.userId
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this patient" });
    }

    if (req.body.age) patient.age = req.body.age;
    if (req.body.medicalHistory) patient.medicalHistory = req.body.medicalHistory;

    if (req.body.contactInfo) {
      if (req.body.contactInfo.phone) patient.contactInfo.phone = req.body.contactInfo.phone;
      if (req.body.contactInfo.address) patient.contactInfo.address = req.body.contactInfo.address;
    }

    await patient.save();
    res.status(200).json({ message: "Patient updated successfully", patient });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "An error occurred while updating the patient" });
  }
};

// Delete patient record (Admins only)
exports.deletePatient = async (req, res) => {
  try {
    const patientId = req.params.id;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID not found" });
    }

    const patient = await Patient.findOne(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await patient.deleteOne();
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "An error occurred while deleting the patient" });
  }
};
