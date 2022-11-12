import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { send } from "../email";
import { Coupon, Item, Order, User } from "../db";
class OrderService {
  // 본 파일의 맨 아래에서, new orderService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor() {}
  async newOrder(data) {
    console.log("주문하기 서비스 진입");
    console.log("주문하기 서비스 진입1");
    const newOrder = await Order.create(data);
    console.log("1");
    await User.updateOne(
      { _id: data.buyer },
      { $push: { orders: newOrder._id } }
    );
    console.log("2");
    const sumUser = await User.findById({ _id: data.buyer }).populate(
      "ownCoupons"
    );
    const SumTotalPrice =
      Number(sumUser.totalPayAmount) + Number(newOrder.totalPrice);
    await User.updateOne(
      { _id: sumUser.id },
      { totalPayAmount: SumTotalPrice }
    );
    console.log("3");
    // 사용한 쿠폰 삭제
    console.log(data.couponId);
    // 사용할 쿠폰이 없다면 pass
    if (data.couponId === undefined || data.couponId === "none") {
      console.log("컨틴뉴~");
    }
    // 사용할 쿠폰이 있다면 업데이트하는 로직
    else if (data.couponId) {
      console.log("쿠폰을 받아왔을때 실행");
      //여기서 data.couponId는 쿠폰의 id값을 의미한다.
      const findcoupon = await Coupon.findOne({ id: data.couponId });
      const findUser = await User.findById(data.buyer).populate("ownCoupons");
      console.log("유저정보", findUser.ownCoupons);
      if (findcoupon) {
        //유저의 ownCoupons와 해당 쿠폰 지우기
        console.log("??");
        console.log(
          "제발 내가 찾는게 맞아라 제발 부탁이야: " + findUser.ownCoupons
        );
        console.log(
          "제발 내가 찾는게 맞아라 제발 부탁이야 유저 맞제?: " + findUser.id
        );
        await User.updateOne(
          { _id: findUser.id },
          { $pull: { ownCoupons: findUser.ownCoupons } }
        );
        await Coupon.deleteOne({ _id: data.couponId });
      } else {
        throw new Error("유효하지 않은 쿠폰입니다.");
      }
    }

    // 결제처리 모두 마친후, 이메일로 발송
    console.log("이메일로보내기 직전");
    // 형석님 수고하셨네요 ㅋㅋ
    // 이메일 발송 추가합니당
    console.log("이메일로 보냄 : ", sumUser.email);
    const sendClient = {
      from: "jinytree1403@naver.com",
      to: sumUser.email,
      subject: "[Hugging] 결제완료  ",
      text: `주문해주셔서 감사합니다.
          결제하신내역입니다.
          -------------------------
          요청사항 : ${newOrder.deliveryMsg}
          결제방법 : ${newOrder.payMethod}
          총 결제금액 : ${newOrder.totalPrice}
          총 ${newOrder.items.length}개 구매하셨습니다.
          결제 일시 : ${newOrder.createdAt}

          감사합니다.
    `,
    };
    const sendAdmin = {
      from: "jinytree1403@naver.com",
      to: "jinytree1403@naver.com",
      subject: "[Hugging] 결제완료  ",
      text: `${sumUser.name}님이 주문한 내역입니다.
          -------------------------
          요청사항 : ${newOrder.deliveryMsg}
          결제방법 : ${newOrder.payMethod}
          총 결제금액 : ${newOrder.totalPrice}
          총 ${newOrder.items.length}개 구매하셨습니다.
          결제 일시 : ${newOrder.createdAt}

    `,
    };
    // send 는 config에 있는 것임.
    // 관리자와 고객 모두에게 이메일 발송
    send(sendClient);
    send(sendAdmin);
    return newOrder;
  }

  async getOrderList(data, page) {
    // await Order.deleteMany({});
    console.log("find orderList!  data :", data);
    console.log("page = ", page);
    const perPage = 6;
    // 토큰에 관리자가 있다면 data 에 관리자가 들어옴
    // await Order.deleteMany({});
    const isNull = await Order.find();
    if (isNull.length === 0) {
      throw new Error("주문내역이 없습니다.");
    }
    if (data === "admin") {
      const total = await Order.countDocuments({});
      const orders = await Order.find({}) // 현재까지 주문한 모든 목록
        .populate("items.id")
        .populate("buyer")
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage);

      const totalPage = Math.ceil(total / perPage);
      let result = [];
      for (let i = 0; i < orders.length; i++) {
        let obj = {}; // json형태로 반환하려고 만든것
        let itemsArr = []; // 상품목록을 깔끔하게 넣으려고
        //
        for (let r = 0; r < orders[i].items.length; r++) {
          // i번째 주문의 items의 길이.
          console.log("여기서 에러가??");
          // console.log(orders[i].items);
          // console.log(orders[i]._id);
          console.log(orders[i].items[r]);
          // 상품삭제시 이부분 id 를 못읽어옴. 예외처리
          if (orders[i].items[r].id !== null)
            itemsArr.push({
              상품: orders[i].items[r].id.name,
              개수: orders[i].items[r].count,
            });
        }
        console.log("obj 생성직전");
        console.log("현재 바이어 존재여부", !orders[i].buyer === false);
        if (!orders[i].buyer) {
          obj = {
            상품목록: itemsArr,
            주문번호: orders[i]._id,
            주문날짜: orders[i].createdAt,
            주문시간: orders[i].createdAt,
            배송상태: orders[i].deliveryStatus,
            구매자이름: "탈퇴한유저",
            구매자이메일: "탈퇴한유저",
            전화번호: "탈퇴한유저",
            주소: "탈퇴한유저",
            수정: orders[i].orderStatus,
            요청사항: orders[i].deliveryMsg,
          };
        } else {
          console.log("현재 바이어 존재여부", !orders[i].buyer === false);

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
            요청사항: orders[i].deliveryMsg,
          };
        }
        result.push(obj);
        // console.log(obj);
        console.log("obj 생성완료");
      }

      return { totalPage, result };
    }
    // 관리자가 아니라면 데이터에는 id가 들어오게 된다
    else {
      const orders = await Order.find({ buyer: data }) // 현재까지 주문한 모든 목록
        .populate("items.id")
        .populate("buyer");
      let result = [];
      for (let i = 0; i < orders.length; i++) {
        console.log("포문 돌아감");
        let obj = {}; // json형태로 반환하려고 만든것
        let itemsArr = []; // 상품목록을 깔끔하게 넣으려고
        //
        for (let r = 0; r < orders[i].items.length; r++) {
          console.log("2포문 돌아감");
          // i번째 주문의 items의 길이.
          itemsArr.push({
            상품: orders[i].items[r].id.name,
            개수: orders[i].items[r].count,
          });
        }
        obj = {
          대표이미지: orders[i].items[0].id.imageUrl,
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
          요청사항: orders[i].deliveryMsg,
          총금액: orders[i].totalPrice,
        };
        result.push(obj);
      }
      console.log(result);
      return result;
    }
  }

  async orderCancel(data) {
    const { id, currentRole } = data;
    console.log("ORDER : 취소 서비스 들어옴");
    // 토큰 권한이 관리자일때 수정로직
    if (currentRole === "admin") {
      console.log("ORDER : 관리자 캔슬");
      // 요청받은 주문번호가 수정가능한 상태인지 체크
      const statusCheck = await Order.findById({ _id: id });
      if (statusCheck.orderStatus === "수정가능") {
        const findUser = await Order.findById(id);
        //삭제된 회원의 총구매금액을 수정할필요는 없음
        if (findUser.buyer._id.length > 2) {
          subTotalPayAmount(id);
        }
        await Order.updateOne(
          { _id: id },
          {
            deliveryStatus: "관리자에 의한 주문취소",
            orderStatus: "수정불가",
          }
        );
        return;
      }
      // 토큰권한 사용자일 경우
    } else if (currentRole === "user") {
      console.log("ORDER : 사용자가 주문취소 버튼 누름");
      await Order.updateOne(
        { _id: id },
        {
          deliveryStatus: "고객주문취소",
          orderStatus: "수정불가",
        }
      );
      return;
    } else {
      throw new Error("ORDER: 로그인 사용자만 이용 가능한 서비스입니다.");
    }
  }
  // 수정 이유가 배송상태 변경일 경우 함수
  async orderSend(data) {
    const { id, reson } = data;
    // 배송상태변경
    await Order.updateMany({ _id: id }, { deliveryStatus: reson });
    // 만약 배송상태가 배송완료라면, 더이상 수정할수 없게 만듬.
    if (reson === "배송완료") {
      const findOrder = await Order.findById(id);

      console.log("내가 찍은 아이디로 일단 주문을 가져와: " + findOrder.items);
      for (let i = 0; i < findOrder.items.length; i++) {
        console.log("배송완료 포문 진입");
        console.log("안에 포문 찍히는 아이디" + findOrder.items[i].id);
        console.log("안에 포문 찍히는 카운트" + findOrder.items[i].count);
        const findItem = await Item.findById({ _id: findOrder.items[i].id });
        let findSales = findItem.sales;
        let result = findSales + findOrder.items[i].count;
        await Item.findByIdAndUpdate(
          { _id: findOrder.items[i].id },
          { sales: result }
        );
      }
      console.log("배송완료 포문 끝");
      await Order.updateMany({ _id: id }, { orderStatus: "수정불가" });
      //
    }
    return;
  }

  async subTotalPayAmount(id) {
    const findOrderOwner = await Order.findById({ _id: id });
    const findUser = await User.findById({ _id: findOrderOwner.buyer });
    const subTotal = findUser.totalPayAmount - findOrderOwner.totalPrice;
    await User.updateOne({ _id: findUser.id }, { totalPayAmount: subTotal });
    return;
  }

  //   const sumUser = await User.findById({ _id: data.buyer });
  // const SumTotalPrice =
  //   Number(sumUser.totalPayAmount) + Number(newOrder.totalPrice);
  // await User.updateOne(
  //   { _id: sumUser.id },
  //   { totalPayAmount: SumTotalPrice }
  // );
}

const orderService = new OrderService();

export { orderService };
