import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Order, User } from "../db";
class OrderService {
  // 본 파일의 맨 아래에서, new orderService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor() {}
  async newOrder(data) {
    const newOrder = await Order.create(data);
    await User.updateOne(
      { _id: data.buyer },
      { $push: { orders: newOrder._id } }
    );
    return newOrder;
  }

  async getOrderList(data) {
    console.log("find orderList!  data :", data);
    // 토큰에 관리자가 있다면 data 에 관리자가 들어옴
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
        result.push(obj);
      }
      return result;
    }
    // 관리자가 아니라면 데이터에는 id가 들어오게 된다
    else {
      const orders = await User.findById(data).populate("orders");
      let listArr = [];
      let obj = {};
      console.log(orders);
      // for (let i = 0; i < orders.length; i++) {
      //   const element = array[i];

      // }
      return orders;
    }
  }

  async orderCancel(data) {
    const { id, currentRole } = data;
    // 토큰 권한이 관리자일때 수정로직
    if (currentRole === "admin") {
      // 요청받은 주문번호가 수정가능한 상태인지 체크
      const statusCheck = await Order.findById({ _id: id });
      if (statusCheck.orderStatus === "수정가능") {
        await Order.updateMany(
          { _id: id },
          {
            deliveryStatus: "관리자에 의한 주문취소",
            orderStatus: "수정불가",
          }
        );
        return;
      } else {
        await Order.updateMany(
          { _id: id },
          {
            deliveryStatus: "주문취소",
            orderStatus: "수정불가",
          }
        );
        return;
      }
    }
  }
  // 수정 이유가 배송상태 변경일 경우 함수
  async orderSend(data) {
    const { id, reson } = data;
    // 배송상태변경
    await Order.updateMany({ _id: id }, { deliveryStatus: reson });
    // 만약 배송상태가 배송완료라면, 더이상 수정할수 없게 만듬.
    if (reson === "배송완료") {
      await Order.updateMany({ _id: id }, { orderStatus: "수정불가" });
    }
    return;
  }
}

const orderService = new OrderService();

export { orderService };
