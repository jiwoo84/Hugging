import express from "express";
import is from "@sindresorhus/is";
import { loginRequired } from "../middlewares";
import { itemService } from "../services/";

const itemRouter = express();

itemRouter.post("/", async (req, res, next) => {
  const data = req.body;
  try {
    const newItem = await itemService.addItem(data);
    return res.status(201).json({
      status: 201,
      msg: "아이템 생성 완료",
      data: newItem,
    });
  } catch (err) {
    next(err);
  }
});

export { itemRouter };
