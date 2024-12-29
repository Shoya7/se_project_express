const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config.js");
const { UnauthorizedError } = require("../errors/custom-errors.js");

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authorization required");
    }

    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;
    next();
  } catch (err) {
    throw new UnauthorizedError("Authorization required");
  }
};

module.exports = auth;
