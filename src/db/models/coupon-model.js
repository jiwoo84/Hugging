import { model } from "mongoose";
import { couponSchema } from "../schemas/coupon-schema";

const Coupon = model("Coupon", couponSchema);
Coupon.schema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

export { Coupon };
