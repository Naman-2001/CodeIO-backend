const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) res.status(401).json({ msg: "No token, authorization denied" });
  try {
    const decoded = jwt.verify(token, "my_little_secret");
    req.user = decoded;

    next();
  } catch (error) {
    res.status(400).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;
