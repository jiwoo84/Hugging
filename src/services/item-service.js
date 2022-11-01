import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Category, Item } from "../db";
class ItemService {
  // 본 파일의 맨 아래에서, new ItemService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor() {}
  async addItem(data) {
    const { category } = data;
    const isCategory = await Category.findOne({ name: category });
    if (!isCategory) {
      throw new Error("해당 카테고리는 없습니다.");
    }
    // 아래는 생성
    const newItem = await Item.create(data);
    //아래는 카테고리 업데이트
    await Category.updateOne({}, { $push: { items: newItem._id } });
    return newItem;
  }
  async findItems() {
    const items = await Item.find({});
    return items;
  }
}

const itemService = new ItemService();

export { itemService };
