const mongoose = require("mongoose");
const User = require("./user");
const questionSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    companyTags: [{ type: String }],
    topicTags: [{ type: String }],
    questionTitle: { type: String },
    questionExplaination: { type: String },
    language: { type: String },
    source: { type: String },
    myApproach: { type: String },
    bestApproach: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);
