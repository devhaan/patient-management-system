const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const patientsRoutes = require("./patient-management/patient-management.route");
const appointmentRoutes = require("./appoinment-management/appointment-management.route");
const userRoutes = require("./user-management/user-management.route");
require("../config/db")

dotenv.config({ path: __dirname + "/.env" });

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));



// API Routes
app.use("/patients", patientsRoutes);
app.use("/users", userRoutes);
app.use("/appointments", appointmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
