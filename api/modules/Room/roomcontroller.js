const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const Room = require("./roomModel");
const Y = require("yjs");
const { MONGO_URL } = require("../../../constants/database");
const { MongodbPersistence } = require("y-mongodb");
const collection = "yjs-transactions";
const ldb = new MongodbPersistence(MONGO_URL, collection);
// import * as decoding from "lib0/decoding";
const decoding = require("lib0/decoding");
const encoding = require("lib0/encoding");
const { fromUint8Array, toUint8Array, Base64 } = require("js-base64");

exports.create = async (req, res, next) => {
  const roomId = uuidv4();
  const user = req.user;
  const newRoom = new Room({
    _id: new mongoose.Types.ObjectId(),
    owner: user._id,
    roomId,
    roomName: "Untitled Document",
    data: {
      code: "",
      notes: "",
    },
  });

  await newRoom.save();

  return res.status(200).json({
    success: true,
    message: "Room created Successfully",
    roomId,
    roomName,
    data,
  });
};

exports.getRoomData = async (req, res, next) => {
  const { roomId } = req.params;
  const userId = req.user._id;
  console.log(userId);
  try {
    //Check if the room already exists
    const myRoom = await Room.findOne({ roomId });
    if (myRoom) {
      return res.status(201).json({
        success: true,
        message: "Room fetched Successfully",
        newRoom: myRoom,
      });
    } else {
      const newRoom = new Room({
        _id: new mongoose.Types.ObjectId(),
        owner: userId,
        roomId,
        roomName: "Untitled Document",
        data: {
          code: "",
          notes: "",
        },
      });

      await newRoom.save();

      return res.status(200).json({
        success: true,
        message: "Room created Successfully",
        newRoom,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getContent = async (req, res, next) => {
  const docName = req.params.roomId;
  const persistedYdoc = await ldb.getYDoc(docName);
  const newUpdates = Y.encodeStateAsUpdate(persistedYdoc);
  const temp = fromUint8Array(newUpdates);
  const resp = Base64.atob(temp);
  return res.send(resp);
};
