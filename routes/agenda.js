const express = require("express");

const router = express.Router();
const {
  getAllAgendaItems,
  getSingleAgendaItem,
  createAgendaItem,
  updateAgendaItem,
  deleteAgendaItem,
} = require("../controllers/agenda");

router.route("/").post(createAgendaItem).get(getAllAgendaItems);
router.route("/:id").get(getSingleAgendaItem).delete(deleteAgendaItem).patch(updateAgendaItem);

module.exports = router;
