import { commentService } from "../services";
import express from "express";
import { loginRequired } from "../middlewares/login-required";
const commentRouter = express();

// 리뷰 추가
commentRouter.post("/", loginRequired, async (req, res, next) => {
  console.log("리뷰추가 라우터에 오신걸 환영합니다.");
  const { currentUserId } = req;
  const { text, itemId } = req.body;
  console.log("text , itemId = ", text, itemId);
  // 후에 비속어 배열모음후 추가할 예정
  // if(비속어필터배열.includes(text)){
  //     throw new Error("비속어는 금지에요")
  // }
  if (!text) {
    throw new Error("공백은 불가능합니다.");
  } else if (text.length < 5) {
    throw new Error("5자 이상 적어주세요");
  }
  try {
    const success = await commentService.addComment(
      text,
      itemId,
      currentUserId
    );
    return res.status(201).json({
      status: 201,
      msg: "리뷰가 추가됐습니다.",
      data: success,
    });
  } catch (err) {
    next(err);
  }
});

// 댓글 삭제
commentRouter.delete("/", loginRequired, async (req, res, next) => {
  console.log("리뷰삭제 라우터에 오신것을 환영합니다");
  const { currentUserId } = req;
  const { itemId, commentId } = req.body;
  try {
    const result = await commentService.deleteComment({
      userId: currentUserId,
      itemId,
      commentId,
    });
    return res.status(200).json({
      status: 200,
      msg: "삭제완료",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

//리뷰 수정
commentRouter.patch("/", loginRequired, async (req, res, next) => {
  console.log("리뷰수정 라우터에 오신것을 환영합니다");
  const { currentUserId } = req;
  const { fixText, commentId } = req.body;
  if (!fixText || fixText.length < 5) {
    throw new Error("바꿀내용을 입력하세요 (10자이상)");
  }
  try {
    const result = await commentService.updateCmt(
      currentUserId,
      commentId,
      fixText
    );
    return res.status(200).json({
      status: 200,
      msg: "수정완료",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

//상품 디테일에서 리뷰 보기
commentRouter.get("/:id", async (req, res, next) => {
  console.log("리뷰보기 라우터에 오신것을 환영합니다");
  const itemId = req.params.id;
  console.log("itemId : ", itemId);
  if (!itemId) {
    throw new Error("아이템 id 값을 다시 가져오시게");
  }
  try {
    const result = await commentService.getAll(itemId);
    return res.status(200).json({
      status: 200,
      msg: "해당상품의 댓글들은 이러함",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

export { commentRouter };
