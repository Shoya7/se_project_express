const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");
const {
  validateUserBody,
  validateAuthentication,
  validateId,
} = require("../middlewares/validation");

// Protected routes
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);
router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateAuthentication, login);
router.get("/users/:id", validateId, getUser);
module.exports = router;
