import { Schema, model } from "mongoose";

const itemSchema = new Schema({
  //가구의 이름
  name: String,
  // 가구의 카테고리
  category: String,
  // 가격
  price: Number,
  // 이미지
  imageUrl: String,
  //상품 옵션
  options: [],
});

export { itemSchema };
