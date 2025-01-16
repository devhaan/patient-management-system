const express = require("express");
const router = express.Router();
const patientController = require("./patient-management.controller");
const authMiddleware = require("../../utills/auth.middleware");

// Patient routes (Protected)
router.post(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize(["Doctor", "Admin"]),
  patientController.createPatient
);
router.get("/", authMiddleware.authenticate, patientController.getPatient);
router.put(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize(["Doctor", "Admin"]),
  patientController.updatePatient
);
router.delete(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize(["Admin"]),
  patientController.deletePatient
);

module.exports = router;
