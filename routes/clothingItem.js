const express = require("express");

const router = express.Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Like
router.put("/:itemId/likes", likeItem);

// Unlike
router.delete("/:itemId/likes", unlikeItem);

// Delete
router.delete("/:itemId", deleteItem);

module.exports = router;
