import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Order } from "../db";
class OrderService {
  // 본 파일의 맨 아래에서, new orderService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor() {}
  async test(data) {
    await Order.create(data);
    return;
  }

  async testView() {
    const orders = await Order.find({}).populate("item"); // = > {wegwegweg, item: _id name, price}
    return orders;
  }
}

const orderService = new OrderService();

export { orderService };
