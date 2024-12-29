const router = require("express").Router();

const clothingItem = require("./clothingItem.js");
const userRouter = require("./users.js");
const { login, createUser } = require("../controllers/users.js");
const {
  validateAuthentication,
  validateUserCreation,
} = require("../middlewares/validation.js");
const { NotFoundError } = require("../errors/custom-errors.js");
router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserCreation, createUser);

router.use("/items", clothingItem);
router.use("/users", userRouter);

router.use("*", (_, __, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;
