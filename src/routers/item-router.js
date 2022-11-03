import express from "express";
import is from "@sindresorhus/is";
import { loginRequired } from "../middlewares";
import { itemService } from "../services/";

const itemRouter = express();

// 상품 추가
itemRouter.post("/", loginRequired, async (req, res, next) => {
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

// 전체상품 조회 - 홈화면
itemRouter.get("/", async (req, res, next) => {
  try {
    const { newItems, bestItems } = await itemService.homeFindItems();
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

// 왜 만들었지/./.? 조회인거 같음.
itemRouter.get("/admin", loginRequired, async (req, res, next) => {
  if (req.currentRole !== "admin") {
    return res.status(400).json({
      status: 400,
      msg: "넌 못지나간다!",
    });
  }
  try {
    const items = await itemService.adminFindItems();
    return res.status(200).json({
      status: 200,
      msg: "보여줌",
      data: items,
    });
  } catch (err) {
    next(err);
  }
});

//상품 상세 페이지 라우팅
itemRouter.get("/:id", async (req, res, next) => {
  const findId = req.params.id;
  try {
    const detailItem = await itemService.detailViewItem(findId);
    return res.status(201).json({
      satus: 201,
      msg: "detail item 상품 데이터입니다.",
      data: detailItem,
    });
  } catch (err) {
    next(err);
  }
});

//상품 지우거나 숨김처리
itemRouter.delete("/:id", loginRequired, async (req, res, next) => {
  console.log(req.currentRole);

  if (req.currentRole == "admin") {
    const findId = req.params.id;
    try {
      const deleteItemData = await itemService.deleteItem(findId);
      return res.status(201).json({
        status: 201,
        msg: deleteItemData,
      });
    } catch (err) {
      next(err);
    }
  }
  return res.status(400).json({
    msg: "잘못된 접근입니다. (관리자가 아닙니다)",
  });
});

export { itemRouter };
