const mongoose = require("mongoose");
const User = require("./user");
const Room = require("./room");

const allRoomSchema = mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("AllRooms", allRoomSchema);
