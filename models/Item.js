const { required } = require("joi");
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for your budget item."],
      maxlength: 25,
    },
    value: {
      type: Number,
      required: [true, "Please provide a value for your budget item."],
    },
    status: {
      type: String,
      enum: ["unpaid", "pending", "paid", "declined"],
      default: "unpaid",
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

module.exports = mongoose.model("Item", ItemSchema);

// Add team attribute - pass in user's team
