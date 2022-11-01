import express from "express";
import { loginRequired } from "../middlewares/login-required";
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

export { orderRouter };

// controllers / orderController.js / export con
