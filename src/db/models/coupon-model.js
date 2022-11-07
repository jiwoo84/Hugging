import { model } from "mongoose";
import { couponSchema } from "../schemas/coupon-schema";

const Coupon = model("Coupon", couponSchema);

export { Coupon };
