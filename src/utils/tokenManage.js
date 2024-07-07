const jwt = require("jsonwebtoken");

exports.assignToken = async (id, email, expressIn) => {
  const info = { id, email, expressIn };
  const token = jwt.sign(info, "qwertyuiopp132237682", {
    expiresIn: "7d",
  });
  return token;
};
