import express from "express";
import { adminRequired, loginRequired } from "../middlewares/login-required";
import { orderService } from "../services";
const orderRouter = express();

orderRouter.post("/", async (req, res, next) => {
  const data = req.body; //data {email, name, items[{의자,6개},나무,] 최종결제금액:90000 }
  try {
    await orderService.newOrder(data);
    return res.status(201).json({
      stauts: 201,
      msg: "ㅋㅋ 만들어짐",
    });
  } catch (err) {
    next(err);
    return;
  }
});

// 주문목록조회 API
orderRouter.get("/", loginRequired, async (req, res, next) => {
  // JWT 에서 디코딩한 id와 권한 값
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
  const { currentRole } = req; // jwt에 의한  권한을 요기담음
  const { id, reson } = req.body || req.query;
  console.log(req.body);
  console.log(req.query);
  // 권한이 관리자일때
  if (currentRole === "admin") {
    if (reson === "orderCancel") {
      try {
        console.log("리즌");
        await orderService.orderCancel({ id, currentRole });
        return res.status(200).json({
          status: 200,
          msg: "관리자취소",
        });
      } catch (err) {
        next(err);
      }
    } else if (reson === "orderSend") {
      await orderService.orderSend(id);
      return res.status(200).json({
        status: 200,
        msg: "발송",
      });
    }
  }
  //권한이 평번함 유저일때는 주문취소기능밖에 없음
  else if (currentRole === "user") {
    try {
      console.log("고객 취소");
      await orderService.orderCancel({ id, currentRole });
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
