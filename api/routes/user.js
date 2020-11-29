const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  User.find({ email })
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          msg: "UserAlready Exists",
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              msg: "Something Went Wrong",
              error: err.toString(),
            });
          } else {
            let newId = new mongoose.Types.ObjectId();
            const token = jwt.sign(
              {
                username: username,
                email: email,
                userId: newId,
              },
              "my_little_secret",
              {
                expiresIn: "30d",
              }
            );

            const user = new User({
              _id: newId,
              email,
              username,
              password: hash,
              token: token,
            });
            user
              .save()
              .then(async (user) => {
                res.status(200).json({
                  msg: "Signup Successfully",
                  userInfo: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                  },
                  token,
                });
              })
              .catch((err) => {
                res.status(400).json({ msg: "Something went wrong" });
              });
          }
        });
      }
    })
    .catch((err) => {
      res.status(400).json({ msg: "Something went wrong" });
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user.length < 1) {
        return res.status(409).json({
          msg: "User does not exist",
        });
      } else {
        console.log(user);
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              return res.status(409).json({ msg: "Invalid credentials" });
            } else {
              res.status(200).json({
                msg: "Login Success",
                userInfo: {
                  username: user.username,
                  email: user.email,
                  token: user.token,
                },
              });
            }
          })
          .catch((err) => {
            return res
              .status(409)
              .json({ msg: "Author failed", error: err.toString() });
          });
      }
    })
    .catch((err) => {
      return res.status(409).json({ msg: "Auth failed" });
    });
});

router.get("/profile", checkAuth, (req, res) => {
  const createdBy = req.user.userId;
  User.findById(createdBy)
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((err) => res.status(400).json({ error: err.toString() }));
});

module.exports = router;
