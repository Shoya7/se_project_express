const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVICE_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.status(201).send(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Error from createItem" });
      }
      return res
        .status(INTERNAL_SERVICE_ERROR)
        .send({ message: "Internal server error" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      res
        .status(INTERNAL_SERVICE_ERROR)
        .send({ message: "Error from getItems" });
    });
};

// const deleteItem = (req, res) => {
//   const { itemId } = req.params;

//   console.log(`deleteItem called with itemId: ${itemId}`);

//   if (!mongoose.Types.ObjectId.isValid(itemId)) {
//     return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
//   }

//   return ClothingItem.findByIdAndDelete(itemId)
//     .orFail(() => {
//       const error = new Error("Card ID not found");
//       error.statusCode = NOT_FOUND;
//       throw error;
//     })
//     .then((item) => {
//       res.status(200).send({ data: item });
//     })
//     .catch((err) => {
//       if (err.name === "CastError") {
//         return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
//       }
//       if (err.statusCode === NOT_FOUND) {
//         return res.status(NOT_FOUND).send({ message: "Item not found" });
//       }
//       return res
//         .status(INTERNAL_SERVICE_ERROR)
//         .send({ message: "Internal server error" });
//     });
// };

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(403)
          .send({ message: "Not authorized to delete this item" });
      }
      return ClothingItem.findByIdAndRemove(itemId);
    })
    .then((item) => res.send(item))
    .catch((err) => res.status(500).send({ message: "Internal server error" }));
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  console.log(`likeItem called with itemId: ${itemId}`);

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .then((item) => {
      if (!item) {
        console.log("No item found with given ID");
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(INTERNAL_SERVICE_ERROR)
        .send({ message: "Internal server error" });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Card ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(INTERNAL_SERVICE_ERROR)
        .send({ message: "Internal server error" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
