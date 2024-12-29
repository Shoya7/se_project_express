const router = require("express").Router();

const auth = require("../middlewares/auth.js");
const { getCurrentUser, updateProfile } = require("../controllers/users.js");
const { validateUpdateProfile } = require("../middlewares/validation.js");
// Protected routes
router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, validateUpdateProfile, updateProfile);

module.exports = router;
