const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    roomId: { type: String },
    roomName: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // participants:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    data: {
      code: { type: String },
      notes: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);
