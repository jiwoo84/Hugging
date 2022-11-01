import { Schema } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, unique: true },
  index: Number,
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
});

export { categorySchema };
