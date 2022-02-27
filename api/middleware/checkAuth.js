const jwt = require("jsonwebtoken");
const User = require("../modules/User/userModel");

const auth = async (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).json({
      success: false,
      error: "Access Denied! No token entered.",
    });

  try {
    const token = req.headers.authorization.split(" ")[1];
    const verified = jwt.verify(token, "confrenz-secret-this-is");

    const user = await User.findById(verified.userId);

    // Storing the user in the request Body
    req.user = user;
    if (user) {
      next();
    } else
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
      err: err.toString(),
    });
  }
};

module.exports = auth;
