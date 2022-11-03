import express from "express";
import is from "@sindresorhus/is";
import axios from "axios";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { sosialService } from "../services";

const sosialRouter = express();

sosialRouter.get("/kakao", async (req, res, next) => {
  try {
    const finalUrl = await sosialService.kakaoStart();
    return res.redirect(`${finalUrl}`);
  } catch (err) {
    next(err);
  }
});
sosialRouter.get("/kakao/oauth", async (req, res, next) => {
  // 동의항목에대한 인증코드를 code에 저장
  const code = req.query.code;
  try {
    // code를 매개변수로 넣어줌
    const result = await sosialService.kakaoFinish(code); // {msg : , accessToken:""}}
    return res.status(201).json({
      msg: result.msg,
      accessToken: result.accessToken,
    });
  } catch (err) {
    next(err);
  }
});
export { sosialRouter };

// //++++++++++++++++
