import { Schema } from "mongoose";

const orderSchema = new Schema({
  deliveryStatus: { type: String, required: true },
  item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  createdAt: { type: Date, default: Date.now() },
  //   buyer: { type: Schema.Types.ObjectId, ref: "", required: true },
});

export { orderSchema };
