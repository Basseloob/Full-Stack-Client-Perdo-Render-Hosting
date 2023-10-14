const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");

const { validateToken } = require("../middlewares/AuthMiddleware");
// const { default: Post } = require("../../client/client/src/pages/Post");

router.get("/", validateToken, async (req, res) => {
  // Finding that the post has been liked before or not :
  const listOfPosts = await Posts.findAll({ include: [Likes] }); // return all the list of posts & Include another model with it --> Likes Model.

  // Querying for all the likes that has been done or exist for the current user who is logged in :
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } }); // UserId = to the logged in user.

  // returning 2 objects --> fix it in the frontend in the Home.js UseEffect axios return :
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id); // primary key.

  console.log("From Posts router navigate to the post from Home.js Navigator.");
  res.json(post);
});

// Query for the all the postes posted by the user :
router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  // We only wanna Query the Posts IDs if the UserId is equal to the ine in the params.
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes], // Also Include the likes MODEL - Join the 2 Tables --> To show in the profile user how many likes has.
  });

  res.json(listOfPosts);
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username; // explanation in video 14 - in the 13:30 minute.

  // will add the UserId in the MySQL table to be accessed when clicking the user profile :
  post.UserId = req.user.id; // req.user.id;  accessing from the stored in JWT.

  await Posts.create(post); // adding to the DB.
  console.log("POST : ", post);
  res.send(post);
});

router.put("/title", validateToken, async (req, res) => {
  // 1) Grab the title from the body :
  const { newTitle, id } = req.body;

  // 2) Update the title column & pass the value of title which we got from the Req.Body - where id is equal to id :
  await Posts.update({ title: newTitle }, { where: { id: id } });

  res.send(newTitle);
});

router.put("/postText", validateToken, async (req, res) => {
  // 1) Grab the title from the body :
  const { newText, id } = req.body;

  // 2) Update the title column & pass the value of title which we got from the Req.Body - where id is equal to id :
  await Posts.update({ postText: newText }, { where: { id: id } });

  res.send(newText);
});

router.delete("/:postId", validateToken, async (req, res) => {
  // 1) Grab the id of the post want to delete :
  const postId = req.params.postId;

  // 2)
  await Posts.destroy({
    where: { id: postId },
  });

  // 3)
  res.json("DELETED SUCCESSFULLY ");
});

module.exports = router;
