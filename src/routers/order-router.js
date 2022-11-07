import express from "express";
import { loginRequired } from "../middlewares/login-required";
import { orderService } from "../services";
const orderRouter = express();

// 주문 하기
orderRouter.post("/", loginRequired, async (req, res, next) => {
  const { currentUserId } = req;
  console.log("주문하기 라우터에 오신걸 환영합니다.");
  const {
    name,
    address,
    phoneNumber,
    deliveryMsg,
    items,
    payMethod,
    totalPrice,
  } = req.body; //data {email, name, items[{의자,6개},나무,] 최종결제금액:90000 }

  const data = { ...req.body, buyer: currentUserId };
  console.log("바디로 보낸것 : ", req.body);
  try {
    console.log("보내질 data : ", data);
    console.log("만들기직전");
    const newOrder = await orderService.newOrder(data);
    console.log("만들어짐 ㅋㅋ");
    return res.status(201).json({
      stauts: 201,
      msg: "ㅋㅋ 만들어짐",
      data: newOrder,
    });
  } catch (err) {
    next(err);
    return;
  }
});

// 주문목록조회 API
orderRouter.get("/", loginRequired, async (req, res, next) => {
  // JWT 에서 디코딩한 id와 권한 값
  console.log("주문목록조회 라우터에 오신걸 환영합니다.");
  const { currentUserId, currentRole } = req;
  try {
    if (currentRole === "admin") {
      const orders = await orderService.getOrderList("admin"); //=>
      return res.status(200).json({
        stauts: 200,
        msg: "관리자용으로 보여주겠음",
        data: orders,
      });
    } else if (currentRole === "user") {
      const id = currentUserId;
      const orders = await orderService.getOrderList(id);
      return res.status(200).json({
        stauts: 200,
        msg: "해당 유저것만 보여주겠음",
        data: orders,
      });
    }
  } catch (err) {
    next(err);
    return;
  }
});

// 주문 취소  또는 배송완료 patch
orderRouter.patch("/", loginRequired, async (req, res, next) => {
  console.log("주문취소 또는 배송수정 라우터에 오신걸 환영합니다.");
  const { currentRole } = req; // jwt에 의한  권한을 요기담음
  const { id, reson } = req.body || req.query;

  console.log(req.body);
  console.log(req.query);
  // 권한이 관리자일때
  if (currentRole === "admin") {
    if (reson === "orderCancel") {
      try {
        console.log("ORDER: 관리자 취소");
        await orderService.orderCancel({ id, currentRole });
        await orderService.subTotalPayAmount(id);
        return res.status(200).json({
          status: 200,
          msg: "관리자취소",
        });
      } catch (err) {
        next(err);
      }
    } else {
      console.log("ORDER: 관리자 배송상태 라우터");
      try {
        const result = await orderService.orderSend({ id, reson });
        console.log("ORDER: ", result);
        return res.status(200).json({
          status: 200,
          msg: `배송상태 ${reson} 로 변경`,
        });
      } catch (err) {
        next(err);
      }
    }
  }
  //권한이 평번함 유저일때는 주문취소기능밖에 없음
  else if (currentRole === "user") {
    try {
      console.log("ORDER: 유저 취소 라우터");
      await orderService.orderCancel({ id, currentRole });
      await orderService.subTotalPayAmount(id);
      return res.status(200).json({
        status: 200,
        msg: "고객취소",
      });
    } catch (err) {
      next(err);
    }
  }
  // 비회원일경우
  else {
    return res.status(400).json("비회원님은 여기 접근할수 없음");
  }
});

export { orderRouter };

// controllers / orderController.js / export con
