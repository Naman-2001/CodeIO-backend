const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const Question = require("../models/question");

const checkAuth = require("../middleware/checkAuth");
const { update } = require("../models/user");

const router = express.Router();

router.post("/post_question", checkAuth, async (req, res) => {
  const {
    companyTags,
    topicTags,
    questionTitle,
    questionExplaination,
    language,
    source,
    myApproach,
    bestApproach,
  } = req.body;

  const createdBy = req.user.userId;

  const question = new Question({
    _id: new mongoose.Types.ObjectId(),
    createdBy,
    companyTags,
    topicTags,
    questionTitle,
    questionExplaination,
    language,
    source,
    myApproach,
    bestApproach,
  });

  await User.updateOne(
    { _id: createdBy },
    {
      $addToSet: {
        companyTags: { $each: companyTags },
        topicTags: { $each: topicTags },
        question,
      },
    }
  )
    .then(async () => {
      await question
        .save()
        .then(() => {
          res.status(200).json({ msg: "Question Created" });
        })
        .catch((err) => {
          res.status(400).json({
            msg: "Unable to create this question",
            error: err.toString(),
          });
        });
    })
    .catch((err) => {
      res.status(400).json({ error: err.toString() });
    });
});

router.get("/all_questions", (req, res) => {
  // const createdBy = req.user.userId;
  Question.find()
    .select("language source questionTitle")
    .populate("createdBy", "_id username")
    .then((ques) => {
      res.status(200).json({ ques });
    })
    .catch((err) => {
      res.status(400).json({ error: err.toString() });
    });
});

router.get("/my_questions", checkAuth, (req, res) => {
  const createdBy = req.user.userId;

  Question.find({ createdBy })
    .then((ques) => {
      res.status(200).json({ ques });
    })
    .catch((err) => {
      res.status(400).json({ error: err.toString() });
    });
});

router.patch("/update/:id", checkAuth, (req, res) => {
  const userId = req.user.userId;
  const questionId = req.params.id;

  const {
    companies,
    topics,
    title,
    explaination,
    language,
    source,
    my_Approach,
    best_Approach,
  } = req.body;

  Question.findById(questionId)
    .then((result) => {
      if (result.createdBy != userId) {
        return res
          .status(403)
          .json({ msg: "You are not authorised to update this ques" });
      }

      const update_fields = {
        companyTags: !companies ? result.companyTags : companies,
        topicTags: !topics ? result.topicTags : topics,
        questionTitle: !title ? result.questionTitle : title,
        questionExplaination: !explaination
          ? result.questionExplaination
          : explaination,
        language: !language ? result.language : language,
        source: !source ? result.source : source,
        myApproach: !my_Approach ? result.myApproach : my_Approach,
        bestApproach: !best_Approach ? result.bestApproach : best_Approach,
      };

      Question.updateOne({ _id: questionId }, update_fields)
        .then((updated) => {
          return res
            .status(200)
            .json({ msg: "Succesfully Updated", ques: result });
        })
        .catch((err) => res.status(400).json({ msg: "Something went wrong" }));
    })
    .catch((err) => res.status(400).json({ msg: "Something went wrong" }));
});

router.delete("/my_question", checkAuth, (req, res) => {
  const userId = req.user.userId;
  const questionId = req.body._id;

  Question.findById(questionId)
    .then((foundQues) => {
      if (foundQues.createdBy != userId) {
        // console.log(foundQues.createdBy, userId);
        return res
          .status(403)
          .json({ msg: "You are not authorized to delete this question" });
      }
      Question.deleteOne({ _id: questionId })
        .then((deleted) => {
          res.status(200).json({ msg: "Successfully deleted", del: foundQues });
        })
        .catch((err) => {
          return res
            .status(400)
            .json({ msg: "Unable to delete this question" });
        });
    })
    .catch((err) => {
      return res.status(400).json({ msg: "Unable to delete this question" });
    });
});

module.exports = router;
