import { Coupon, User } from "../db";
import { itemSchema } from "../db/schemas/item-schema";

class CouponService {
  constructor() {}

  async getCouponList(findId) {
    console.log("쿠폰 조회 서비스로직 진입");
    const findCoupons = await User.findById(findId);
    console.log("여기에 내가 찾는게 찍힘? : " + findCoupons.ownCoupons);
    const couponList = await Coupon.find({ _id: findCoupons.ownCoupons });
    console.log("ㅋㅋ 이번에도 제대로 찾았쥬? : " + couponList);

    return couponList;
  }
}

const couponService = new CouponService();

export { couponService };
