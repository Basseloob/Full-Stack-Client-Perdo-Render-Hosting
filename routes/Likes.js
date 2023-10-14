const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { where } = require("sequelize");

router.post("/", validateToken, async (req, res) => {
  // 1) Get the information from the body :
  const { PostId } = req.body;
  // 1) getting the user id from 'server/routes/Users.js --->    // 5) Creating the jsonwebtoken AFTER signin in :
  // const accessToken = sign(
  //     { username: user.username, id: user.id },
  //     "importantsecret"
  //   );
  const UserId = req.user.id;

  // 2) Only one like per POST :
  const found = await Likes.findOne({
    where: { PostId: PostId, UserId: UserId },
  });

  // 3) If no likes has been found then Create a like :
  if (!found) {
    await Likes.create({ PostId: PostId, UserId: UserId });
    // res.json("Liked The Post");
    res.json({ liked: true });
  } else {
    // 4) Delete the previous like if found - Destroy it from the like table:
    await Likes.destroy({ where: { PostId: PostId, UserId: UserId } });
    // res.json("Unliked The Post");
    res.json({ liked: false });
  }
});

module.exports = router;
