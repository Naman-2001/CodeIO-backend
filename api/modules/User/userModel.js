const mongoose = require("mongoose");
// const Question = require("../models/question");
// const Room = require("./room");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String },
  email: { type: String },
  providers: [
    {
      name: { type: String, enum: ["Google", "Local"] },
      id: { type: String },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
