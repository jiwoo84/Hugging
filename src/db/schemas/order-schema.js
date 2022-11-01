import { Schema } from "mongoose";

const orderSchema = new Schema({
  // 배송상태 // 추후 관리자가 수정가능하게
  deliveryStatus: { type: String, required: true, default: "배송준비중" },
  // 상품들의 이름과 개수가 들어있는 배열 ex) [{id:상품명,count:개수}]
  items: [
    {
      id: { type: Schema.Types.ObjectId, ref: "Item", required: true },
      count: Number,
    },
  ],
  // 만들어진 시간
  createdAt: { type: Date, default: Date.now() },
  // 구매자 //토큰으로 알아서 판별가능
  buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  // 프론트에서 장바구니에 있는 총 액을 보내주어야 함
  totalPrice: Number,
});

export { orderSchema };
