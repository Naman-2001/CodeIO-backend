const mongoose = require("mongoose");
const Question = require("../models/question");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String },
  email: { type: String },
  password: { type: String },
  token: { type: String },

  companyTags: [{ type: String }],
  topicTags: [{ type: String }],

  question: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: "Question",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
