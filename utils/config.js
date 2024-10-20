require("dotenv").config();

const { JWT_SECRET = "secret-key" } = process.env;

module.exports = { JWT_SECRET };
