import { orderSchema } from "../schemas/order-schema";
import { model } from "mongoose";

const Order = model("Order", orderSchema);
export { Order };
