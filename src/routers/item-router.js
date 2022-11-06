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

// 전체상품 조회 - newItems, bestItems 리턴
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

// 관리자가 상품 CRU 하기위해 요청하는 곳, 전체상품을 리턴한다.
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

// 카테고리에 속하지  아이템들을 리스트로 리턴함
itemRouter.get("/affiliation", loginRequired, async (req, res, next) => {
  const { currentRole } = req;
  if (currentRole !== "admin") {
    throw new Error("넌 못지나간다!");
  }
  const noAffiliations = await itemService.noAffiliation();
  return res.status(200).json({
    msg: "존재하지 않은 카테고리에 담긴 아이템의 배열",
    data: noAffiliations,
  });
});

//관리자 주문 수정
itemRouter.patch("/:id", loginRequired, async (req, res, next) => {
  const findItemId = req.params.id;
  const { currentRole } = req;
  const { name, category, price, imageUrl, itemDetail, onSale } = req.body;
  if (currentRole !== "admin") {
    return res.status(400).json({
      status: 400,
      msg: "잘못된 접근입니다. (관리자가 아닙니다)",
    });
  }

  try {
    const toUpdate = {
      ...(name && { name }),
      ...(category && { category }),
      ...(price && { price }),
      ...(imageUrl && { imageUrl }),
      ...(itemDetail && { itemDetail }),
      ...(onSale && { onSale }),
    };

    const updateItem = await itemService.updateItem(findItemId, toUpdate);
    return res.status(201).json({
      status: 201,
      msg: "상품이 정상적으로 변경 되었습니다.",
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
