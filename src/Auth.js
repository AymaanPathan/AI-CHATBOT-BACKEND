const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const Auth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log(token);
    }
    if (!token) {
      return res
        .status(401)
        .json({ message: "Please Register/Login before Accessing Chat Route" });
    }
    const decoded = await promisify(jwt.verify)(token, "biggestpasswordever");
    console.log(decoded);
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Invalid Signature. Please login again." });
    } else {
      return res
        .status(401)
        .json({ message: "Invalid token. Please login again." });
    }
  }
};

module.exports = Auth;
