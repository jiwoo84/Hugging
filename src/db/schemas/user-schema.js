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
});

// export const User = model("User", UserSchema);

export { UserSchema };
