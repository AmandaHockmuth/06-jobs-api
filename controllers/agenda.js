const { StatusCodes } = require("http-status-codes");
const Agenda = require("../models/Agenda");
const User = require("../models/User");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllAgendaItems = async (req, res) => {
  const user = await User.find({ _id: req.user.userId });
  const team = user[0].team;
  const agendaItems = await Agenda.find({ team: team }).sort("createdAt");
  res.status(StatusCodes.OK).json({ agendaItems, count: agendaItems.length });
};

const getSingleAgendaItem = async (req, res) => {
  const user = await User.find({ _id: req.user.userId });
  const team = user[0].team;
  const {
    params: { id: agendaItemId },
  } = req;
  const agendaItem = await Agenda.findOne({
    _id: agendaItemId,
    team: team,
  });
  if (!agendaItem) {
    throw new NotFoundError(`No Item matching id ${agendaItemId}`);
  }
  res.status(StatusCodes.OK).json({ agendaItem });
};

const createAgendaItem = async (req, res) => {
  const user = await User.find({ _id: req.user.userId });
  req.body.createdBy = req.user.userId;
  req.body.team = user[0].team;
  const agendaItem = await Agenda.create(req.body);
  res.status(StatusCodes.CREATED).json({ agendaItem });
};

const updateAgendaItem = async (req, res) => {
  const user = await User.find({ _id: req.user.userId });
  const team = user[0].team;
  const {
    body: { agendaTitle, priority, deadline, agendaStatus },
    params: { id: agendaItemId },
  } = req;
  if (!agendaTitle || !priority || !deadline || !agendaStatus) {
    throw new BadRequestError(`Please provide valid entries for all fields`);
  }
  const agendaItem = await Agenda.findByIdAndUpdate(
    {
      _id: agendaItemId,
      team: team,
    },
    req.body,
    { new: true, runValidators: true }
  );
  if (!agendaItem) {
    throw new NotFoundError(`No item matching id ${agendaItemId}`);
  }
  res.status(StatusCodes.OK).json({ agendaItem });
};

const deleteAgendaItem = async (req, res) => {
  const user = await User.find({ _id: req.user.userId });
  const userTeam = user[0].team;
  const {
    params: { id: agendaItemId },
  } = req;
  const agendaItem = await Agenda.find({
    _id: agendaItemId,
  });
  const agendaItemTeam = agendaItem[0].team;

  if (userTeam !== agendaItemTeam) {
    throw new BadRequestError(
      "You may not delete an item from another teams agenda."
    );
  }
  if (!agendaItem) {
    throw new NotFoundError(
      `No item matching id ${agendaItemId}. It may have already been deleted. Try refreshing.`
    );
  } else {
    const deletedAgendaItem = await Agenda.findByIdAndDelete({
      _id: agendaItemId,
    });
    res
      .status(StatusCodes.OK)
      .json({ msg: `Item ${deletedAgendaItem} deleted` });
  }
};

module.exports = {
  getAllAgendaItems,
  getSingleAgendaItem,
  createAgendaItem,
  updateAgendaItem,
  deleteAgendaItem,
};
