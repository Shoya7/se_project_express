const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem.js");

const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../errors/custom-errors.js");
const { CREATED, OK } = require("../utils/errors.js");
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  const owner = req.user._id;

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(CREATED).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
        return;
      }
      next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(OK).send(items))
    .catch(next);
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    next(new BadRequestError("Invalid ID format"));
    return;
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item not found"));
        return;
      }
      if (item.owner.toString() !== req.user._id) {
        next(new ForbiddenError("Not authorized to delete this item"));
        return;
      }
      return item.remove().then(() => res.send({ message: "Item deleted" }));
    })
    .catch(next);
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    next(new BadRequestError("Invalid ID format"));
    return;
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Clothing item not found"));
        return;
      }
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
        return;
      }
      next(err);
    });
};

const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    next(new BadRequestError("Invalid ID format"));
    return;
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item not found"));
        return;
      }
      res.status(OK).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
        return;
      }
      next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
