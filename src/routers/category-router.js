import { categoryService } from "../services";
import express from "express";
import { loginRequired } from "../middlewares/login-required";
const categoryRouter = express();

//카테고리 생성
categoryRouter.post("/", loginRequired, async (req, res, next) => {
  console.log("카테고리생성 라우터에 오신걸 환영합니다!!");
  const { currentRole } = req;
  if (currentRole !== "admin") {
    throw new Error("관리자만 접근 가능합니다.");
  }
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
//전체 카테고리 조회
categoryRouter.get("/all", async (req, res, next) => {
  console.log("전체카테고리조회 라우터에 오신걸 환영합니다!!");
  try {
    const categories = await categoryService.getAll();
    return res.status(200).json({
      status: 200,
      msg: "카테고리 전체 조회",
      data: categories,
    });
  } catch (err) {
    next(err);
  }
});

// 카테고리 하나만 조회, 쿼리로 받음
categoryRouter.get("/", async (req, res, next) => {
  console.log("카테고리하나조회 라우터에 오신걸 환영합니다!!");
  let { name, index } = req.query;
  index = index.slice(0, -1);
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

//카테고리 수정
categoryRouter.patch("/", loginRequired, async (req, res, next) => {
  console.log("카테고리수정 라우터에 오신걸 환영합니다!!");
  const { currentRole } = req;
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

//카테고리 삭제
categoryRouter.delete("/", loginRequired, async (req, res, next) => {
  console.log("카테고리삭제 라우터에 오신걸 환영합니다!!");
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
