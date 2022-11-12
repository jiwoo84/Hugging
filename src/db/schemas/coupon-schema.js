import { Schema } from "mongoose";

const couponSchema = new Schema({
  name: { type: String },
  discount: Number,
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export { couponSchema };
