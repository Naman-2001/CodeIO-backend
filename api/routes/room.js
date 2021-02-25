const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const Room = require("../models/room");

const checkAuth = require("../middleware/checkAuth");
const { update } = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

router.post("/createroom", async (req, res) => {
  const { email } = req.body;

  const roomid = uuidv4();
  const room = new Room({
    _id: new mongoose.Types.ObjectId(),
    roomId: roomid,
    content: "",
    createdBy: email,
  });

  await room
    .save()
    .then(async (roomInfo) => {
      res.status(200).json({
        msg: "Signup Successfully",
        roomid: roomInfo.roomId,
        id: roomInfo._id,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: "Something went wrong" });
    });
});

router.patch("/save", async (req, res) => {
  const { roomid, content, id } = req.body;

  Room.findById(id)
    .then((result) => {
      // if (result.createdBy != userId) {
      //   return res
      //     .status(403)
      //     .json({ msg: "You are not authorised to update this ques" });
      // }

      const update_fields = {
        content,
      };

      Room.updateOne({ _id: id }, update_fields)
        .then((updated) => {
          return res
            .status(200)
            .json({ msg: "Succesfully Updated", update: result });
        })
        .catch((err) => res.status(400).json({ msg: "Something went wrong" }));
    })
    .catch((err) => res.status(400).json({ msg: "Something went wrong" }));
});

module.exports = router;
