import { Coupon, User } from "../db";

class CouponService {
  constructor() {}

  async getCouponList(findId) {
    const findCoupons = await User.findById(findId);
    console.log("여기에 내가 찾는게 찍힘? : " + findCoupons.ownCoupons);
    const couponList = await Coupon.findById(findCoupons.ownCoupons);
    console.log("ㅋㅋ 이번에도 제대로 찾았쥬? : " + couponList);
    return couponList;
  }
}

const couponService = new CouponService();

export { couponService };
