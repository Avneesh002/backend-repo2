const jwt = require("jsonwebtoken");

function authentication(req, res, next) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, "post_management");
    if (decoded) {
      req.body.user = decoded.user;
      next();
    } else {
      res.status(400).send({ msg: "You are not Logged In" });
    }
  } catch (error) {
    res.status(404).send({ msg: "Authentication Failed" });
  }
}

module.exports = { authentication };
