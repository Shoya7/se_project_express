require("dotenv").config();

const {
  JWT_SECRET = "e3e4618ef95cffaba72576d126cabc65d9475aad248e519567ff58d1c2c10a7e",
} = process.env;

module.exports = {
  JWT_SECRET,
};
