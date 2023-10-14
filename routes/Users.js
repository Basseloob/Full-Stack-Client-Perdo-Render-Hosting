const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

const { Users } = require("../models");

// Registration :
router.post("/", async (req, res) => {
  // 1) Get the username and password from the body.
  const { username, password } = req.body;

  // 2) Hash the password :
  bcrypt.hash(password, 10).then((hash) => {
    // 3) Save the original username & hashed password to the DB :
    Users.create({
      username: username,
      password: hash,
    });

    // 4) Send the response :
    res.json("SUCCESS");
  });
});

// Login :
router.post("/login", async (req, res) => {
  // 1) Grab the username & password :
  const { username, password } = req.body;

  // 2) Got to the Users table then find all the users where the users column in the table - is equal to the username that trying to login :
  const user = await Users.findOne({ where: { username: username } });

  // 3) Checking if user exist :
  if (!user) res.json({ error: "User does not exist!" });

  // 4) Compare the entered password VS the password in the DB - then the matched password
  bcrypt.compare(password, user.password).then((match) => {
    if (!match) res.json({ error: "Wrong Username & Password!" });

    // 5) Creating the jsonwebtoken AFTER signin in :
    const accessToken = sign(
      { username: user.username, id: user.id },
      "importantsecret"
    );

    console.log("This the accessToken : ", accessToken);

    // res.json("from './server/routes/User.js/ login'  : You logged in !");
    // res.json(accessToken);
    // 6) Return the Token , username & user ID :
    // we gonna pass this data into the Login Button function in the Client/Login.js :
    res.json({ token: accessToken, username: username, id: user.id });
  });
});

// Route for Getting the info for loggedin user.
router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  // No need to validate it a public data.
  // 1) Get the ID from the params :
  const id = req.params.id;

  // 2) Query for the User.id = passed id from params & then exclude the password field :
  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  // 3)
  res.json(basicInfo);
});

// validateToken will get the username :
router.put("/changepassword", validateToken, async (req, res) => {
  // 1) Grab the password from the body :
  const { oldPassword, newPassword } = req.body;

  // 2) Check if the old password is matched in the system : current === old :
  const user = await Users.findOne({ where: { username: req.user.username } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong Password Entered!" });

    // 3 if the match is perfect : Hash the password the new password :
    bcrypt.hash(newPassword, 10).then((hash) => {
      // 3) Save the original username & hashed password to the DB :
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );

      // 4) Send the response :
      res.json("SUCCESS");
    });
  });
});

module.exports = router;
