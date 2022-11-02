import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Order } from "../db";
class OrderService {
  // 본 파일의 맨 아래에서, new orderService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor() {}
  async newOrder(data) {
    await Order.create(data);
    return;
  }

  async getOrderList(data) {
    if (data === "admin") {
      const orders = await Order.find({}) // 현재까지 주문한 모든 목록
        .populate("items.id")
        .populate("buyer");
      console.log(orders);
      let result = [];
      for (let i = 0; i < orders.length; i++) {
        let obj = {}; // json형태로 반환하려고 만든것
        let itemsArr = []; // 상품목록을 깔끔하게 넣으려고
        //
        for (let r = 0; r < orders[i].items.length; r++) {
          // i번째 주문의 items의 길이.
          itemsArr.push({
            상품: orders[i].items[r].id.name,
            개수: orders[i].items[r].count,
          });
        }
        console.log("여기가문제?");
        console.log(itemsArr);
        obj = {
          상품목록: itemsArr,
          주문번호: orders[i]._id,
          주문날짜: orders[i].createdAt,
          주문시간: orders[i].createdAt,
          배송상태: orders[i].deliveryStatus,
          구매자이름: orders[i].buyer.name,
          구매자이메일: orders[i].buyer.email,
          전화번호: orders[i].buyer.phoneNumber,
          주소: orders[i].buyer.address,
          수정: orders[i].orderStatus,
        };
        console.log("여기가문제?");
        result.push(obj);
      }
      return result;
    } else {
      const orders = await Order.find({ _id: data })
        .populate("item")
        .populate("buyer");
      return orders;
    }
  }

  async orderCancel(data) {
    const { id, currentRole } = data;
    if (currentRole === "admin") {
      await Order.updateOne(
        { _id: id },
        { deliveryStatus: "관리자에 의한 주문 취소" },
        { orderStatus: "수정불가" }
      );
      return;
    } else {
      await Order.updateOne(
        { _id: id },
        { deliveryStatus: "주문 취소" },
        { orderStatus: "수정불가" }
      );
      return;
    }
  }
  async orderSend(_id) {
    await Order.updateOne(
      { _id },
      { deliveryStatus: "발송완료" },
      { orderStatus: "수정불가" }
    );
    return;
  }
}

const orderService = new OrderService();

export { orderService };
