const bcrypt = require("bcrypt");
const Thread = require("../models/thread");

const saltRounds = 10;

exports.threadPost = async (req, res) => {
  try {
    const board = req.params.board || req.body.board;

    const hashed_password = await bcrypt.hash(
      req.body.delete_password,
      saltRounds
    );

    const newThread = new Thread({
      board: board,
      text: req.body.text,
      delete_password: hashed_password,
    });
    await newThread.save();

    return res.redirect("/b/" + board);
  } catch (e) {
    return res.json("error");
  }
};

exports.threadGet = async (req, res) => {
  try {
    const board = req.params.board || req.body.board;

    const threadsArray = await Thread.find(
      { board: board },
      { delete_password: 0, reported: 0, __v: 0 }
    )
      .sort({ bumped_on: "desc" })
      .limit(10);

    const newThreadsArray = threadsArray.map((thread) => {
      const replycount = thread.replies.length;
      let newReplies;

      if (replycount > 0) {
        newReplies = thread.replies.map((reply) => {
          return {
            _id: reply._id,
            text: reply.text,
            created_on: reply.created_on,
          };
        });
        if (replycount > 1) {
          //Sort the replies
          newReplies.sort(function (a, b) {
            let keyA = new Date(a.created_on);
            let keyB = new Date(b.created_on);
            keyA > keyB ? -1 : keyA < keyB ? 1 : 0;
          });
        }
      }

      return {
        _id: thread._id,
        board: thread.board,
        text: thread.text,
        created_on: thread.created_on,
        bumped_on: thread.bumped_on,
        replies: newReplies ? newReplies : thread.replies,
        replycount: replycount,
      };
    });

    return res.json(newThreadsArray);
  } catch (err) {
    return res.json("error");
  }
};

exports.threadPut = async (req, res) => {
  try {
    const board = req.params.board || req.body.board;
    await Thread.findOneAndUpdate(
      { _id: req.body.thread_id, board: board },
      { $set: { reported: true } }
    );
    return res.send("reported");
  } catch (e) {
    return res.json("error");
  }
};

exports.threadDelete = async (req, res) => {
  try {
    const board = req.params.board || req.body.board;
    const foundThread = await Thread.findOne(
      { _id: req.body.thread_id, board: board },
      { delete_password: 1 }
    );
    const match = await bcrypt.compare(
      req.body.delete_password,
      foundThread.delete_password
    );
    if (match) {
      await Thread.deleteOne({ _id: req.body.thread_id, board: board });
      return res.send("success");
    } else {
      return res.send("incorrect password");
    }
  } catch (e) {
    return res.json("error");
  }
};
