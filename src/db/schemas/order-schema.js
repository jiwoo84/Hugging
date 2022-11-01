import { Schema } from "mongoose";

const orderSchema = new Schema({
  deliveryStatus: { type: String, required: true, default: "배송준비중" },
  items: [
    {
      id: { type: Schema.Types.ObjectId, ref: "Item", required: true },
      count: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now() },
  //   buyer: { type: Schema.Types.ObjectId, ref: "", required: true },
});

export { orderSchema };
