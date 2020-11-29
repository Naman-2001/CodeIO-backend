const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const PORT = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const url =
  "mongodb+srv://admin-naman_075:+4!b8BvB6NHACDX@cluster0.ichgj.mongodb.net/ideDB?retryWrites=true&w=majority";

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

const UserRoutes = require("./api/routes/user");
const QuestonRoutes = require("./api/routes/question");

app.use("/user", UserRoutes);
app.use("/question", QuestonRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, (req, res) => {
  console.log("Server Started in port " + PORT);
});
