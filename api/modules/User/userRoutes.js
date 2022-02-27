const express = require("express");
const userControllers = require("./userController");
const checkAuth = require("../../middleware/checkAuth");
const router = express.Router();

// User Auth
router.post("/auth", userControllers.auth);

//Get User Rooms
router.post("/rooms", checkAuth, userControllers.getUserRooms);

module.exports = router;
