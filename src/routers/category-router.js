import { categoryService } from "../services";
import express from "express";
const categoryRouter = express();

categoryRouter.post("/", async (req, res, next) => {
  const { name } = req.body;
  if (!name || name === "") {
    return res.status(400).json({
      status: 400,
      msg: "이름이 없습니다.",
    });
  }
  try {
    const category = await categoryService.newCategory(name);
    return res.status(201).json({
      status: 201,
      msg: "카테고리 생성 완료",
      data: category,
    });
  } catch (err) {
    next(err);
  }
});

export { categoryRouter };
