const mongoose = require("mongoose");
// const Question = require("../models/question");
const Room = require("./room");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String },
  email: { type: String },
  password: { type: String },
  token: { type: String },
  // roomsOwned: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Room",
  //   },
  // ],
  // roomsShared: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Room",
  //   },
  // ],
});

module.exports = mongoose.model("User", userSchema);
