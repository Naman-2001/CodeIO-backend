const mongoose = require("mongoose");
const User = require("./user");
const roomSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    roomId: { type: String },
    content: { type: String },
    createdBy: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);
