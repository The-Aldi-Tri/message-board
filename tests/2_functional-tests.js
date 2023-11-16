const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let testThreadId1;
let testThreadId2;
let testReplyId1;
let testReplyId2;

suite("Functional Tests", function () {
  suite("Thread Tests", function () {
    test("Creating 2 new thread: POST request to /api/threads/{board}", function (done) {
      chai
        .request(server)
        .post("/api/threads/testboard")
        .send({
          text: "Test Text 1",
          delete_password: "Valid Password",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
        });

      chai
        .request(server)
        .post("/api/threads/testboard")
        .send({
          text: "Test Text 2",
          delete_password: "Valid Password",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
        });
      done();
    });

    test("Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}", function (done) {
      chai
        .request(server)
        .get("/api/threads/testboard")
        .end((err, res) => {
          if (err) console.log(err);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAtMost(res.body.length, 10);
          res.body.forEach((element) => {
            assert.isAtMost(element.replies.length, 3);
          });
          testThreadId1 = res.body[1]._id;
          testThreadId2 = res.body[0]._id;
          done();
        });
    });

    test("Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password", function (done) {
      chai
        .request(server)
        .delete("/api/threads/testboard")
        .send({
          thread_id: testThreadId1,
          delete_password: "Invalid Password",
        })
        .end((err, res) => {
          if (err) console.log(err);
          assert.equal(res.status, 200);
          assert.equal(res.text, "incorrect password");
          done();
        });
    });

    test("Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password", function (done) {
      chai
        .request(server)
        .delete("/api/threads/testboard")
        .send({
          thread_id: testThreadId1,
          delete_password: "Valid Password",
        })
        .end((err, res) => {
          if (err) console.log(err);
          assert.equal(res.status, 200);
          assert.equal(res.text, "success");
          done();
        });
    });

    test("Reporting a thread: PUT request to /api/threads/{board}", function (done) {
      chai
        .request(server)
        .put("/api/threads/testboard")
        .send({
          thread_id: testThreadId2,
        })
        .end((err, res) => {
          if (err) console.log(err);
          assert.equal(res.status, 200);
          assert.equal(res.text, "reported");
          done();
        });
    });
  });

  suite("Reply Tests", function () {
    test("Creating 2 new reply: POST request to /api/replies/{board}", function (done) {
      chai
        .request(server)
        .post("/api/replies/testboard")
        .send({
          thread_id: testThreadId2,
          text: "Test Text Reply 1",
          delete_password: "Valid Password",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
        });
      chai
        .request(server)
        .post("/api/replies/testboard")
        .send({
          thread_id: testThreadId2,
          text: "Test Text Reply 2",
          delete_password: "Valid Password",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
        });
      done();
    });
    test("Viewing a single thread with all replies: GET request to /api/replies/{board}", function (done) {
      chai
        .request(server)
        .get("/api/replies/testboard")
        .query({ thread_id: testThreadId2 })
        .end((err, res) => {
          if (err) console.log(err);
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.isArray(res.body.replies);
          testReplyId1 = res.body.replies[1]._id;
          testReplyId2 = res.body.replies[0]._id;
          done();
        });
    });

    test("Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password", function (done) {
      chai
        .request(server)
        .delete("/api/replies/testboard")
        .send({
          thread_id: testThreadId2,
          reply_id: testReplyId1,
          delete_password: "Invalid Password",
        })
        .end((err, res) => {
          if (err) console.log(err);
          assert.equal(res.status, 200);
          assert.equal(res.text, "incorrect password");
          done();
        });
    });

    test("Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password", function (done) {
      chai
        .request(server)
        .delete("/api/replies/testboard")
        .send({
          thread_id: testThreadId2,
          reply_id: testReplyId1,
          delete_password: "Valid Password",
        })
        .end((err, res) => {
          if (err) console.log(err);
          assert.equal(res.status, 200);
          assert.equal(res.text, "success");
          done();
        });
    });

    test("Reporting a thread: PUT request to /api/threads/{board}", function (done) {
      chai
        .request(server)
        .put("/api/replies/testboard")
        .send({
          thread_id: testThreadId2,
          reply_id: testReplyId2,
        })
        .end((err, res) => {
          if (err) console.log(err);
          assert.equal(res.status, 200);
          assert.equal(res.text, "reported");
          done();
        });
    });
  });
});
