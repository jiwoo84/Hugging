import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Item } from "../db";
class ItemService {
  // 본 파일의 맨 아래에서, new ItemService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor() {}
  async addItem(data) {
    await Item.create(data);
  }
  async findItems() {
    const items = await Item.find({});
    return items;
  }
}

const itemService = new ItemService();

export { itemService };
