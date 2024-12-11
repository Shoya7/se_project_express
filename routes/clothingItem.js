const router = require("express").Router();
const auth = require("../middlewares/auth");
const { likeItem, unlikeItem } = require("../controllers/clothingItems");
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");

const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");
router.get("/", getItems);

router.post("/", auth, createItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, unlikeItem);
router.delete("/:itemId", auth, deleteItem);
router.post("/", validateClothingItem, createItem);
router.delete("/:id", validateId, deleteItem);
module.exports = router;
