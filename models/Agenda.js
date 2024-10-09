const { required, date } = require("joi");
const mongoose = require("mongoose");

const AgendaSchema = new mongoose.Schema(
  {
    agendaTitle: {
      type: String,
      required: [true, "Please provide a title for your agenda item."],
      maxlength: 25,
    },
    deadline: {
      type: Date,
      required: [true, "Please provide a valid date for your agenda item."],
    },
    priority: {
      type: Number,
    },
    agendaStatus: {
      type: String,
      enum: [
        "received",
        "accepted",
        "declined",
        "pending",
        "completed",
        "delayed",
      ],
      default: "received",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user."],
    },
    team: {
      type: String,
      required: [true, "Please provide team."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agenda", AgendaSchema);
