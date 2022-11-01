import express from "express";
import is from "@sindresorhus/is";
import { loginRequired } from "../middlewares";
import { itemService } from "../services/";

const itemRouter = express();
itemRouter.post("/",loginRequired, async (req, res, next) => {
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

itemRouter.get("/",  async (req, res, next) => {
  try {
    const {newItems,bestItems} = await itemService.itemList();
    return res.status(200).json({
      status: 200,
      msg: "아이템리스트",
      newItems,
      bestItems,
    });
  } catch (err) {
    next(err);
  }
});
itemRouter.get("/admin", loginRequired, async (req, res, next) => {
  if (req.currentRole !== "admin") {
    return res.status(400).json({
      status: 400,
      msg: "넌 못지나간다!",
    });
  }
  try {
    const items = await itemService.itemList();
    return res.status(200).json({
      status: 200,
      msg: "보여줌",
      data: items,
    });
  } catch (err) {
    next(err);
  }
});

export { itemRouter };
