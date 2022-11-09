import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  // 사용자가 적은 이메일
  email: {
    type: String,
    required: true,
  },
  // 사용자 이름
  name: {
    type: String,
    required: true,
  },
  //비밀번호
  password: {
    type: String,
    required: true,
  },
  // 전화번호
  phoneNumber: {
    type: String,
    required: true,
  },
  // 주소
  address: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: false,
    default: "user",
  },
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  // 소셜로그인 여부, 후에 개인정보 수정시 비밀번호 필요없게만듬
  sosial: { type: Boolean, default: false },
  // 총 결재 금액
  totalPayAmount: { type: Number, default: 0 },
  // 가지고있는 댓글들   ** 아이템을 참조하고있음!!
  ownComments: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  // 리프레쉬토큰
  refreshToken: String,
  // 쿠폰
  ownCoupons: [{ type: Schema.Types.ObjectId, ref: "Coupon" }],
});

// export const User = model("User", UserSchema);

export { UserSchema };
