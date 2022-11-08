import express from "express";
import is from "@sindresorhus/is";
import { itemImg, loginRequired, namingItem } from "../middlewares";
import { itemService } from "../services/";
const MY_DOMAIN = process.env.KAKAO_REDIRECT || "http://localhost:5000";
const itemRouter = express();

// 상품 추가
itemRouter.post(
  "/",
  loginRequired,
  namingItem,
  itemImg.single("itemAddbox_imgInput"),
  async (req, res, next) => {
    console.log("상품추가 라우터에 오신걸 환영합니다!!");
    const data = req.query;
    const fileData = `${MY_DOMAIN}/${req.file.path}`;
    console.log("쿼리로 받아온 값 : ", data);
    console.log("파일 정보 : ", req.file);
    console.log("파일이 저장된경로 : ", fileData);
    // item 의 price 값은 Number이므로 형변환
    data.price = Number(data.price);
    //data 에 imageURL 키값추가, 값은 저장된파일의 경로
    data.imageUrl = fileData;
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
  }
);

// 전체상품 조회 - newItems, bestItems 리턴
itemRouter.get("/", async (req, res, next) => {
  console.log("홈화면 상품조회 라우터에 오신걸 환영합니다!!");
  try {
    const { newItems, bestItems } = await itemService.homeFindItems();
    // console.log(newItems, bestItems);
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

//pagination
itemRouter.get("/paging", async (req, res, next) => {
  console.log("페이지네이션 진입");
  //page = 1, perPage = 9

  const page = Number(req.query.page || 1);
  const perPage = Number(req.query.perPage || 9);
  console.log("타입ㅡㅡ:" + typeof page);
  try {
    const pagingItems = await itemService.paginationItems({ page, perPage });
    // console.log(pagingItems);

    return res.status(201).json({
      status: 201,
      msg: "페이징네이션 구현완료",
      pagingItems,
    });
  } catch (err) {
    next(err);
  }
});

// 상품 검색
itemRouter.get("/search", async (req, res, next) => {
  console.log("검색 라우터에 오신걸 환영합니다.");
  const { word } = req.query;
  console.log("word : ", word);
  if (!word) {
    return res.status(400).json({
      status: 400,
      msg: "공백으로 검색할 수 없습니다.",
    });
  }
  try {
    const reward = await itemService.searchItems(word);
    return res.status(200).json({
      status: 200,
      msg: `'${word}'를 포함하는 상품을 찾아봤습니다.`,
      data: reward,
    });
  } catch (err) {
    next(err);
  }
});

// 관리자가 상품 CRU 하기위해 요청하는 곳, 전체상품을 리턴한다.
itemRouter.get("/admin", loginRequired, async (req, res, next) => {
  console.log("관리자 상품조회 라우터에 오신걸 환영합니다!!");
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
  console.log("무소속 아이템조회 라우터에 오신걸 환영합니다!!");
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

//관리자 상품 수정
itemRouter.patch("/:id", loginRequired, async (req, res, next) => {
  console.log("관리자 상품수정 라우터에 오신걸 환영합니다!!");
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
  console.log(" 상품상세조회 라우터에 오신걸 환영합니다!!");
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
  console.log("상품삭제_수정 라우터에 오신걸 환영합니다!!");

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
