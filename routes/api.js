"use strict";
const {
  threadPost,
  threadGet,
  threadPut,
  threadDelete,
} = require("../controllers/threadHandler");
const {
  replyPost,
  replyGet,
  replyPut,
  replyDelete,
} = require("../controllers/replyHandler");

module.exports = function (app) {
  app
    .route("/api/threads/:board")
    .post(threadPost)
    .get(threadGet)
    .put(threadPut)
    .delete(threadDelete);

  app
    .route("/api/replies/:board")
    .post(replyPost)
    .get(replyGet)
    .put(replyPut)
    .delete(replyDelete);
};
