import { Schema } from "mongoose";

const commentSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  affiliation: { type: Schema.Types.ObjectId, ref: "Item" },
  text: { type: String, minlength: 5, maxlength: 40 },
  createdAt: { type: Date, default: Date.now },
});

export { commentSchema };
