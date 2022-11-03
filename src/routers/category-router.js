import { categoryService } from "../services";
import express from "express";
import { loginRequired } from "../middlewares/login-required";
const categoryRouter = express();

categoryRouter.post("/", async (req, res, next) => {
  const { name, index } = req.body;
  if (!name || name === "") {
    return res.status(400).json({
      status: 400,
      msg: "이름이 없습니다.",
    });
  }
  try {
    const category = await categoryService.newCategory({ name, index });
    return res.status(201).json({
      status: 201,
      msg: "카테고리 생성 완료",
      data: category,
    });
  } catch (err) {
    next(err);
  }
});

categoryRouter.get("/", async (req, res, next) => {
  const { name, index } = req.query;
  if (!name || !index) {
    return res.status(400).json({
      status: 400,
      msg: "쿼리값을 확인하세요",
    });
  }
  try {
    const categoriesItems = await categoryService.categoriesItems({
      name,
      index,
    });
    return res.status(200).json({
      status: 200,
      msg: `${name}이름의 카테고리 리스트`,
      data: categoriesItems,
    });
  } catch (err) {
    next(err);
  }
});
categoryRouter.patch("/", loginRequired, async (req, res, next) => {
  const currentRole = req;
  const { name, index, currentName } = req.body;
  if (currentRole !== "admin") {
    return res.status(400).json({
      msg: "카테고리는 관리자만 변경 가능합니다.",
    });
  }
  try {
    const updateCategory = categoryService.updateCategory({
      name,
      index,
      currentName,
    });
    return res.status(201).json({
      msg: "카테고리 변겅에 성공하였습니다.",
    });
  } catch (err) {
    next(err);
  }
});

categoryRouter.delete("/", loginRequired, async (req, res, next) => {
  const { currentRole } = req;
  const { index, name } = req.body;
  if (currentRole !== "admin") {
    return res.status(400).json({
      msg: "카테고리는 관리자만 변경 가능합니다.",
    });
  }

  try {
    const deleteCategory = categoryService.deleteCategory({ index, name });
    return res.status(201).json({
      msg: "카테고리가 정상적으로 삭제되었습니다.",
    });
  } catch (err) {
    next(err);
  }
});

export { categoryRouter };
