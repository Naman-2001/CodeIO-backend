const express = require("express");
const userRoutes = require("./api/modules/User/userRoutes");
const roomRoutes = require("./api/modules/Room/roomRoutes");
const router = express.Router();

router.use("/user", userRoutes);
router.use("/room", roomRoutes);
// DEV ROUTES
// if (process.env.NODE_ENV === "dev") {
//   router.use("/dev", require("./modules/dev/devRoutes"));
// }

module.exports = router;
