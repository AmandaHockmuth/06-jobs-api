const { StatusCodes } = require("http-status-codes");
const Item = require("../models/Item");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllItems = async (req, res) => {
  const items = await Item.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ items, count: items.length });
};

const getSingleItem = async (req, res) => {
  const {
    user: { userId },
    params: { id: itemId },
  } = req;
  const item = await Item.findOne({
    _id: itemId,
    createdBy: userId,
  });
  if (!item) {
    throw new NotFoundError(`No Item matching id ${itemId}`);
  }
  res.status(StatusCodes.OK).json({ item });
};

const createItem = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const item = await Item.create(req.body);
  res.status(StatusCodes.CREATED).json({ item });
};

const updateItem = async (req, res) => {
  const {
    body: { title, value },
    user: { userId },
    params: { id: itemId },
  } = req;
  if (!title || !value) {
    throw new BadRequestError(`Please provide valid title and value.`);
  }
  const item = await Item.findByIdAndUpdate(
    {
      _id: itemId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );
  if (!item) {
    throw new NotFoundError(`No Item matching id ${itemId}`);
  }
  res.status(StatusCodes.OK).json({ item });
};

const deleteItem = async (req, res) => {
  const {
    user: { userId },
    params: { id: itemId },
  } = req;
  const item = await Item.findByIdAndDelete({
    _id: itemId,
    createdBy: userId,
  });
  if (!item) {
    throw new NotFoundError(`No Item matching id ${itemId}`);
  }
  res.status(StatusCodes.OK).json({ msg: `Item ${itemId} deleted` });
};

module.exports = {
  getAllItems,
  getSingleItem,
  createItem,
  updateItem,
  deleteItem,
};
