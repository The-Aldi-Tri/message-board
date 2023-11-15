const bcrypt = require("bcrypt");
const Thread = require("../models/thread");

const saltRounds = 10;

exports.replyPost = async (req, res, next) => {
  try {
    const board = req.params.board || req.body.board;
    const thread_id = req.body.thread_id;

    const hashed_password = await bcrypt.hash(
      req.body.delete_password,
      saltRounds
    );

    const newReply = {
      text: req.body.text,
      created_on: new Date(),
      delete_password: hashed_password,
      reported: false,
    };

    await Thread.findOneAndUpdate(
      { _id: thread_id, board: board },
      { $push: { replies: newReply }, $set: { bumped_on: new Date() } }
    );

    return res.redirect("/b/" + board + "/" + thread_id);
  } catch (e) {
    return res.json("error");
  }
};

exports.replyGet = async (req, res) => {
  try {
    const foundThread = await Thread.findOne(
      { _id: req.query.thread_id, board: req.params.board },
      { delete_password: 0, reported: 0, __v: 0 }
    );

    const replyCount = foundThread.replies.length;
    let newReplies;

    if (replyCount > 0) {
      newReplies = foundThread.replies.map((reply) => {
        return {
          _id: reply._id,
          text: reply.text,
          created_on: reply.created_on,
        };
      });
      if (replyCount > 1) {
        //Sort the replies
        newReplies.sort(function (a, b) {
          let keyA = new Date(a.created_on);
          let keyB = new Date(b.created_on);
          keyA > keyB ? -1 : keyA < keyB ? 1 : 0;
        });
      }
    }

    if (newReplies) {
      foundThread.replies = newReplies;
    }

    return res.json(foundThread);
  } catch (err) {
    return res.json("error");
  }
};

exports.replyPut = async (req, res) => {
  try {
    const board = req.params.board || req.body.board;

    let foundThread = await Thread.findOne({
      _id: req.body.thread_id,
      board: board,
    });

    foundThread.replies.forEach((element) => {
      if (element._id == req.body.reply_id) {
        element.reported = true;
      }
    });

    await foundThread.save();
    return res.send("reported");
  } catch (e) {
    return res.json("error");
  }
};

exports.replyDelete = async (req, res) => {
  try {
    const board = req.params.board || req.body.board;

    let foundThread = await Thread.findOne({
      _id: req.body.thread_id,
      board: board,
    });

    let flag = false;

    foundThread.replies.forEach((element) => {
      if (element._id == req.body.reply_id) {
        const match = bcrypt.compareSync(
          req.body.delete_password,
          element.delete_password
        );
        if (match) {
          element.text = "[deleted]";
          flag = true;
        }
      }
    });

    if (flag) {
      await foundThread.save();
      return res.send("success");
    } else {
      return res.send("incorrect password");
    }
  } catch (e) {
    return res.json("error");
  }
};
