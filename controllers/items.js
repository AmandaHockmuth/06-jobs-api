const { StatusCodes } = require("http-status-codes");
const Item = require("../models/Item");
const User = require("../models/User");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllItems = async (req, res) => {
  const user = await User.find({ _id: req.user.userId });
  const team = user[0].team;
  const items = await Item.find({ team: team }).sort("createdAt");
  res.status(StatusCodes.OK).json({ items, count: items.length });
};

const getSingleItem = async (req, res) => {
  const user = await User.find({ _id: req.user.userId });
  const team = user[0].team;
  const {
    params: { id: itemId },
  } = req;
  const item = await Item.findOne({
    _id: itemId,
    team: team,
  });
  if (!item) {
    throw new NotFoundError(`No Item matching id ${itemId}`);
  }
  res.status(StatusCodes.OK).json({ item });
};

const createItem = async (req, res) => {
  const user = await User.find({ _id: req.user.userId });
  req.body.createdBy = req.user.userId;
  req.body.team = user[0].team;
  const item = await Item.create(req.body);
  res.status(StatusCodes.CREATED).json({ item });
};

const updateItem = async (req, res) => {
  const user = await User.find({ _id: req.user.userId });
  const team = user[0].team;
  const {
    body: { title, value },
    params: { id: itemId },
  } = req;
  if (!title || !value) {
    throw new BadRequestError(`Please provide valid title and value.`);
  }
  const item = await Item.findByIdAndUpdate(
    {
      _id: itemId,
      team: team,
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
  const user = await User.find({ _id: req.user.userId });
  const userTeam = user[0].team;
  const {
    params: { id: itemId },
  } = req;
  const item = await Item.find({
    _id: itemId,
  });
  const itemTeam = item[0].team;

  if (userTeam !== itemTeam) {
    throw new BadRequestError(
      "You may not delete an item from another teams budget."
    );
  }
  if (!item) {
    throw new NotFoundError(
      `No Item matching id ${itemId}. It may have already been deleted. Try refreshing.`
    );
  } else {
    const deletedItem = await Item.findByIdAndDelete({
      _id: itemId,
    });
    res.status(StatusCodes.OK).json({ msg: `Item ${deletedItem} deleted` });
  }
};

module.exports = {
  getAllItems,
  getSingleItem,
  createItem,
  updateItem,
  deleteItem,
};
