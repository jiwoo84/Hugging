import express from "express";
import { orderService } from "../services";
const orderRouter = express();

orderRouter.post("/", async (req, res, next) => {
  const data = req.body; //data {email, name }
  try {
    // await orderService.test(data);
    return res.status(201).json({
      stauts: 201,
      msg: "ㅋㅋ 만들어짐",
    });
  } catch (err) {
    next(err);
    return;
  }
});

orderRouter.get("/", async (req, res, next) => {
  try {
    const orders = await orderService.testView();
    console.log(orders);
    return res.status(200).json({
      stauts: 200,
      msg: "ㅋㅋ보여주겠음",
      data: orders,
    });
  } catch (err) {
    next(err);
    return;
  }
});

export { orderRouter };

// controllers / orderController.js / export con
