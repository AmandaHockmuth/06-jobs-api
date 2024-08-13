const express = require("express");

const router = express.Router();
const {
  getAllItems,
  getSingleItem,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/items");

router.route("/").post(createItem).get(getAllItems);
router.route("/:id").get(getSingleItem).delete(deleteItem).patch(updateItem);

module.exports = router;
