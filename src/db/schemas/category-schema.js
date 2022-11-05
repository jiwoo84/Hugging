import { Schema } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, unique: true },
  index: String,
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
});

export { categorySchema };
