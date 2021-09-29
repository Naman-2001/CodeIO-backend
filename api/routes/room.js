const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Room = require("../models/room");
const AllRooms = require("../models/allRooms");
const checkAuth = require("../middleware/checkAuth");
const { update } = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const utils = require("y-websocket/bin/utils.js");
const setupWSConnection = utils.setupWSConnection;
const Y = require("yjs");
const WebSocket = require("ws");
const wss = new WebSocket.Server({ noServer: true });
const sgMail = require("@sendgrid/mail");
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

utils.setPersistence({
  bindState: async (documentName, doc) => {
    await delay(1000);
    console.log(documentName);
    // const foundCell = await Room.findById(documentName);
    let foundCell = {};
    await Room.findById(documentName)
      .then(async (room) => {
        console.log(room);
        foundCell = room;
      })
      .catch((err) => {
        console.log(err);
      });
    // .then(async (roomData) => {
    //   console.log(roomData);
    //   return { roomData };
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
    console.log(foundCell);

    const foundSourceCode = foundCell.content;
    const yText = doc.getText("monaco");
    yText.insert(0, foundSourceCode);
    const ecodedState = Y.encodeStateAsUpdate(doc);
    doc.on("update", (update) => {
      Y.applyUpdate(doc, update);
    });

    return Y.applyUpdate(doc, ecodedState);
  },
  writeState: (_identifier, _doc) => {
    return new Promise((resolve) => {
      resolve();
    });
  },
});

wss.on("connection", setupWSConnection);

router.get("/getContent/:id/:roomid", async (req, res) => {
  const { id, roomid } = req.params;

  let roomData = {};
  await Room.findById(id)
    .then(async (room) => {
      console.log(room);
      roomData = room;
      res.status(200).json({ room });
    })
    .catch((err) => {
      res.status(400).json({ error: err.toString() });
    });
});

// router.post()

router.post("/roomcreate", async (req, res) => {
  const { roomid } = req.params;

  // await AllRooms.findById({ roomid })
  //   .then((res) => {
  //     console.log(res);
  //     return req.status(200).json({ msg: res });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

router.post("/createroom", async (req, res) => {
  const { email } = req.body;

  let roomId = "";
  while (true) {
    roomId = uuid();
    const roomfound = await Room.findOne({ roomdId });
    if (!roomfound) {
      break;
    }
  }
  const room = new Room({
    _id: new mongoose.Types.ObjectId(),
    roomId,
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

router.post("/sendinvite/:id/:roomid", async (req, res) => {
  const { id, roomid } = req.params;
  const { fromEmail, toEmail } = req.body;
  sgMail.setApiKey(
    "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"
  );

  const msg = {
    to: toEmail,
    from: {
      email: "rajat.development@gmail.com",
      name: "CodeIO",
    },
    subject: `CODEIO Invitation from ${fromEmail}`,
    text: ` `,
    html: `<h1>https://naman-2001.github.io/CodeIO-IDE/${id}/${roomid}</h1>`,
  };

  await sgMail
    .send(msg)
    .then(async () => {
      console.log("mail sent");
    })
    .catch((err) => {
      console.log("mail not sent");
    });
});

module.exports = router;
