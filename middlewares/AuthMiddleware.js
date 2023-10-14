// 1- grab the token that has sent through the frontend - then validate the token
//    by using jwt function called verify. if its valid send the comment to the DB.

const { verify } = require("jsonwebtoken");

// 2- add validateToken before the route of posting comments.
const validateToken = (req, res, next) => {
  // 1) Accessing the variables that in the Headers from the frontend named "accessToken" :
  const accessToken = req.header("accessToken");

  // 2) Check if the user is logged in :
  if (!accessToken) return res.json({ error: "User not logged in!" });

  try {
    // 3) compare the accessToken that we got form the request & compare it using the same secret that we used to create the Token from
    //    in the "./client/page/Login.js" login function : "importantsecret"
    const validToken = verify(accessToken, "importantsecret");

    // this for showing the username per each posted comment :
    req.user = validToken;

    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = { validateToken };
