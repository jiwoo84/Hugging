import { Schema, model } from "mongoose";

const itemSchema = new Schema({
  //가구의 이름
  name: { type: String, unique: true },
  // 가구의 카테고리
  category: String,
  // 가격
  price: Number,
  //아이템 상세정보
  itemDetail: String,
  // 이미지
  imageUrl: String,
  // 판매량
  sales: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  //판매중 true, 판매중지 false
  onSale: { type: Boolean, default: true },
});

export { itemSchema };
