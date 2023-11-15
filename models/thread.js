const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  board: { type: String, required: true },
  text: { type: String, required: true },
  created_on: { type: Date, default: new Date() },
  bumped_on: { type: Date, default: new Date() },
  delete_password: { type: String, required: true },
  reported: { type: Boolean, default: false },
  replies: [
    {
      text: String,
      created_on: Date,
      delete_password: String,
      reported: Boolean,
    },
  ],
});

const Thread =
  mongoose.models.Thread || mongoose.model("Thread", threadSchema, "Threads");

module.exports = Thread;
