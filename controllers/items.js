const { StatusCodes } = require("http-status-codes");
const Item = require("../models/Item");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllItems = async (req, res) => {
  res.send("Get All Items");
};

const getSingleItem = async (req, res) => {
  res.send("Get Single Item");
};

const createItem = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const item = await Item.create(req.body);
  res.status(StatusCodes.CREATED).json({ item });
};

const updateItem = async (req, res) => {
  res.send("update");
};

const deleteItem = async (req, res) => {
  res.send("delete");
};

module.exports = {
  getAllItems,
  getSingleItem,
  createItem,
  updateItem,
  deleteItem,
};
