const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const WebSocket = require("ws");
const http = require("http");

//@ts-ignore
const utils = require("y-websocket/bin/utils");
const setupWSConnection = utils.setupWSConnection;
const Y = require("yjs");

const database = require("./config/database");
require("dotenv").config();

var app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// var expressWs = require("express-ws")(app);

// const crdt = require("./crdt");

app.set("trust proxy", 1);
var limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message:
    "Too many requests created from this IP, please try again after an hour",
});
app.use(limiter);

//Use helmet to prevent common security vulnerabilities
app.use(helmet());

//Use body-parser to parse json body
app.use(bodyParser.urlencoded({ limit: "100mb", extended: false }));
app.use(bodyParser.json("100mb"));

// Allow CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, auth-token"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(cors());

wss.on("connection", setupWSConnection);

// server.on("upgrade", (request, socket, head) => {
//   // You may check auth of request here..

//   const handleAuth = (ws) => {
//     wss.emit("connection", ws, request);
//   };
//   wss.handleUpgrade(request, socket, head, handleAuth);
// });

app.use("/", require("./routes"));

//This function will give a 404 response if an undefined API endpoint is fired
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    success: false,
    message: error.message || "Something went wrong",
  });
  console.trace(error);
});

const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;
