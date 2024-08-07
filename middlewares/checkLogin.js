const jwt = require("jsonwebtoken");

const checklogin = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username, userId, type } = decoded;
    req.username = username;
    req.userId = userId;
    req.type = type;
    next();
  } catch {
    next("Authentication Failure!");
  }
};

module.exports = checklogin;
