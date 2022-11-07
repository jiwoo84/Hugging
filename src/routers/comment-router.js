import { commentService } from "../services";
import express from "express";
import { loginRequired } from "../middlewares/login-required";
const commentRouter = express();

// 리뷰 추가
commentRouter.post("/", loginRequired, async (req, res, next) => {
  const { currentUserId } = req;
  const { text, itemId } = req.body;
  // 후에 비속어 배열모음후 추가할 예정
  // if(비속어필터배열.includes(text)){
  //     throw new Error("비속어는 금지에요")
  // }
  if (!text) {
    throw new Error("공백은 불가능합니다.");
  } else if (text.length < 10) {
    throw new Error("10자 이상 적어주세요");
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

export { commentRouter };
