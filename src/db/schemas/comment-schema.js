import { Schema } from "mongoose";

const commentSchema = new Schema({
  name: { type: String },
  discount: Number,
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  // expired 해보기
});

export { commentSchema };
