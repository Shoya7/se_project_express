// const express = require("express");
// const router = express.Router();
const router = require("express").Router();
const auth = require("../middlewares/auth");
const { likeItem, unlikeItem } = require("../controllers/clothingItems");

const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");
// Public route
router.get("/", getItems);

// Protected routes
router.post("/", auth, createItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, unlikeItem);
router.delete("/:itemId", auth, deleteItem);

module.exports = router;
