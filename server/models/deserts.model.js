const mongoose = require("mongoose");
const DesertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
    },
    calories: {
      type: Number,
      required: [true, "Calories are required"],
    },
  },
  {
    timestamps: true,
  }
);

const Desert = mongoose.model("Desert", DesertSchema);
module.exports = Desert;
