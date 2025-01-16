const express = require("express");
const router = express.Router();
const appointmentController = require("./appointment-management.controller");
const authMiddleware = require("../../utills/auth.middleware");

// Appointment routes (Protected)
router.post(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize(["Patient", "Admin"]),
  appointmentController.bookAppointment
);
router.get(
  "/",
  authMiddleware.authenticate,
  appointmentController.getAppointment
);
router.put(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize(["Doctor", "Admin"]),
  appointmentController.updateAppointment
);
router.delete(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize(["Admin", "Patient"]),
  appointmentController.deleteAppointment
);

module.exports = router;
