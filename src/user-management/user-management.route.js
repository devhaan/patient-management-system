const express = require("express");
const router = express.Router();
const userController = require("./user-management.controller");
console.log("jij")
// Auth routes
router.post("/register", userController.register);
router.post("/login", userController.login);


module.exports = router;
