const express = require("express");
const roomControllers = require("./roomcontroller");
const checkAuth = require("../../middleware/checkAuth");
const router = express.Router();

// Create and fetch Room
router.get("/:roomId", checkAuth, roomControllers.getRoomData);

router.get("/data/:roomId", roomControllers.getContent);
module.exports = router;
