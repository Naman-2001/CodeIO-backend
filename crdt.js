//@ts-ignore
const utils = require("y-websocket/bin/utils");
const setupWSConnection = utils.setupWSConnection;
const Y = require("yjs");
const { MONGO_URL } = require("./constants/database");
const { MongodbPersistence } = require("y-mongodb");
const collection = "yjs-transactions";
const ldb = new MongodbPersistence(MONGO_URL, collection);
const Room = require("./api/modules/Room/roomModel");
const { fromUint8Array, toUint8Array, Base64 } = require("js-base64");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

utils.setPersistence({
  bindState: async (docName, ydoc) => {
    // await delay(1000);
    // // console.log(documentName);
    // // const foundCell = await Room.findById(documentName);
    // let foundCell = {};
    // await Room.findOne({ roomId: docName })
    //   .then(async (room) => {
    //     foundCell = room;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // console.log(foundCell);
    // const foundSourceCode = foundCell.data.code;
    // const yText = ydoc.getText("codemirror");
    // yText.insert(0, foundSourceCode);
    // const ecodedState = Y.encodeStateAsUpdate(ydoc);
    // Y.applyUpdate(doc, ecodedState);
    // ydoc.on("update", (update) => {
    //   console.log(update)
    //   Y.applyUpdate(ydoc, update);
    // });
    // const persistedYdoc = await ldb.getYDoc(docName);
    // const newUpdates = Y.encodeStateAsUpdate(ydoc);
    // const resp = Base64.atob(fromUint8Array(newUpdates));
    // ldb.storeUpdate(docName, newUpdates);
    // Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
    // ydoc.on("update", async (update) => {
    //   //   console.log(newUpdates);
    //   ldb.storeUpdate(docName, update);
    // });
  },
  writeState: (_identifier, _doc) => {
    return new Promise((resolve) => {
      resolve();
    });
  },
});
