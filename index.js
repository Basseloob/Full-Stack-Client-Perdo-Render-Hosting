const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json()); // parsing the body in req.bod.
app.use(cors()); // making an api req from the computer that exist in the comouter.

// Including the Table :
const db = require("./models");

// /\//\/\/\/\//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\//\/\//\/\/\/\/\/\/\/\/\/\/\/
// Routers :

// #1 POSTS :
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);

// #2 COMMENTS :
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);

// #3 USERS :
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

// #4 USERS :
const likesRouter = require("./routes/Likes");
app.use("/like", likesRouter);

// /\//\/\/\/\//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\//\/\//\/\/\/\/\/\/\/\/\/\/\/
// Starting the Server & Connecting to the DB:
db.sequelize.sync().then(() => {
  port = 3001;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
