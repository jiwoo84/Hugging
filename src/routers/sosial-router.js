import express from "express";
import is from "@sindresorhus/is";
import axios from "axios";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { sosialService } from "../services";

const sosialRouter = express();

sosialRouter.get("/kakao", async (req, res, next) => {
  try {
    const finalUrl = await sosialService.kakaoStart();
    return res.status(200).json({
      msg: "리다이렉팅필요합니다 url로 이동해주세요",
      url: finalUrl,
    });
  } catch (err) {
    next(err);
  }
});
//액세스토큰 검증
sosialRouter.post("/kakao/oauth", async (req, res, next) => {
  // 동의항목에대한 인증코드를 code으로 받아옴
  const { code } = req.body;
  console.log(code);
  try {
    // code를 매개변수로 넣어줌
    console.log("코드까진 잘 들어간다");
    const result = await sosialService.kakaoGetToken(code); // {msg : , accessToken:""}}
    console.log(result);
    console.log("ㅋㅋ?");
    return res.status(200).json({
      msg: "카카오전용 액세스토큰 발급!",
      accessToken: result,
    });
  } catch (err) {
    next(err);
  }
});
sosialRouter.post("/kakao", async (req, res, next) => {
  // 동의항목에대한 인증코드를 code에 저장
  const { access_token } = req.body;
  try {
    // code를 매개변수로 넣어줌
    const result = await sosialService.kakaoFinish(access_token); // {msg : , accessToken:""}}
    return res.status(201).json({
      msg: result.msg,
      token: result.token,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    next(err);
  }
});
export { sosialRouter };

// //++++++++++++++++
