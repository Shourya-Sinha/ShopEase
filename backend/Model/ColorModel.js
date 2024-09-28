import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  hexCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt:{ type: Date, default: Date.now},
});

const Color = mongoose.model("Color", colorSchema);

export default Color;
