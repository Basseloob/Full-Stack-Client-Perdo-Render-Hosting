const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// router.get("/:postId", async (req, res) => {
//   const postId = req.params.postId; // the id written in the Link.
//   // const comments = await Comments.findByPk(postId); // search for this id in the DB.
//   const comments = await Comments.findAll({ where: { PostId: postId } });

//   res.json(comments);
// });
router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  //
  const comments = await Comments.findAll({ where: { PostId: postId } });
  console.log(" postId inside Comments.js router : ", comments);
  res.json(comments);
});

router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  // for Showing the username per each posted comment :
  const username = req.user.username; // copy the username from the authenticated user.
  comment.username = username;

  await Comments.create(comment);
  res.json(comment);
});

router.delete("/:commentId", validateToken, async (req, res) => {
  // 1) get the comment id from the route.
  const commentId = req.params.commentId;
  await Comments.destroy({ where: { id: commentId } }); // means inside of the comments table i want to destroy the filled the row which has element with id --> commentId.

  // 2) Check if the comment belongs to the user who want to delete this comment by passing validateToken.

  // 3)
  res.json("Deleted Successfully...");
});

module.exports = router;
