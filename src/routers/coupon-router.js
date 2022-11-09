import { couponService } from "../services";
import express from "express";
import { loginRequired } from "../middlewares";

const couponRouter = express();

couponRouter.get("/:id", loginRequired, async (req, res, next) => {
  console.log("쿠폰 조회 라우터!!!!!!!!!!!!!");
  //해당 유저의 아이디
  const findId = req.params.id;
  //역할 구분
  const { currentRole } = req;
  console.log(findId);
  console.log(currentRole);

  if (currentRole !== "user") {
    throw new Error("옳바른 사용자가 아닙니다.");
  }
  try {
    const couponList = await couponService.getCouponList(findId);

    res.status(201).json({
      couponList,
    });
  } catch (err) {
    next(err);
  }
});

export { couponRouter };
