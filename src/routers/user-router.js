import express from "express";
import is from "@sindresorhus/is";
import jwt from "jsonwebtoken";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from "../middlewares";
import { userService } from "../services";
import { itemService } from "../services/item-service";
// import { send } from "../email";
const userRouter = express();
// jwt 검증만 하는 라우터
userRouter.get("/authority", (req, res) => {
  console.log("jwt검증 라우터에 오신걸 환영합니다!!");
  const userToken = req.headers["authorization"]?.split(" ")[1];
  console.log(userToken);
  if (!userToken) {
    return res.status(400).json({
      status: 400,
      msg: "토큰이 없어요, 이 창구는 권한 및 로그인 체크하는 곳입니다.\n토큰발급후 시도해주세요",
    });
  }
  const secretKey = process.env.JWT_SECRET_KEY;
  const jwtDecoded = jwt.verify(userToken, secretKey, (err, data) => {
    if (err) {
      console.log("액세스토큰이 유효하지 않음!");
      return res.status(400).json({ msg: "정상적인 토큰이 아닙니다." });
    }
    return data;
  });
  console.log(jwtDecoded);
  const { role, sosial } = jwtDecoded;
  return res.status(200).json({
    status: 200,
    authority: `${role}`,
    sosial: `${sosial}`,
  });
});

// 리프레쉬 토큰으로 토큰재발급
userRouter.post("/refresh", async (req, res, next) => {
  const reciveRt = req.body.refreshToken;
  console.log("받은 RT ", req.body);
  const secretKey = process.env.JWT_SECRET_KEY;
  // RT 검증
  console.log("RT 검증에서 막히나?");
  try {
    const verified = jwt.verify(reciveRt, secretKey, (err, payload) => {
      console.log("데러 뱉기 전 ");
      if (err) {
        return false;
      }
      // 검증완료시 같은 payload로 토큰 두개 재발급.
      const returnAt = jwt.sign(
        { userId: payload.userId, role: payload.role },
        secretKey,
        { expiresIn: 60 * 60 }
      );
      const returnRt = jwt.sign(
        { userId: payload.userId, role: payload.role },
        secretKey,
        { expiresIn: 60 * 60 * 24 }
      );
      console.log("뱉기직전");
      return { returnAt, returnRt, payload };
    });
    console.log("verified 값 : ", verified);
    if (!verified) {
      return res.status(400).json({
        msg: "토큰오류",
      });
    }
    const accessToken = verified.returnAt;
    const refreshToken = verified.returnRt;
    const userId = verified.payload.userId;
    console.log("리프레쉬 수정중");
    //  변수두개 설정하여 가독성 ++
    // RT 데이터 수정작업임
    // 해당유저가 이 리프레쉬 토큰을 가지고 있는지 검증도 해야함
    await userService.refresh(userId, refreshToken, reciveRt);
    return res.status(201).json({
      msg: "AT 재발급",
      token: accessToken,
      refreshToken,
    });
  } catch (err) {
    console.log("리프레쉬 수정중 오류발생");
    next(err);
  }
});

// userRouter.get("/email", async (req, res, next) => {
//   const toEmail = req.query.toEmail;
//   const random = (min, max) => {
//     let result = Math.floor(Math.random() * (max - min + 1)) + min;
//     return result;
//   };
//   const number = random(111111, 999999);
//   const mailInfo = {
//     from: "speaker1403@naver.com",
//     to: toEmail,
//     subject: "[Hugging] 인증번호 발송 ",
//     text: `${number} 를 입력해주세요.`,
//   };
//   const b = send(mailInfo);
//   return res.status(203).json({
//     msg: "전송",
//     zz: b,
//   });
// });

// 회원가입 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
userRouter.post("/join", async (req, res, next) => {
  console.log("회원가입 라우터에 오신걸 환영합니다!!");
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const { name, email, password, address, phoneNumber } = req.body;
    console.log(email);
    // 위 데이터를 유저 db에 추가하기
    const newUser = await userService.addUser({
      name,
      email,
      password,
      address,
      phoneNumber,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json({
      status: 201,
      msg: "회원가입 성공!",
      accessToken: newUser,
    });
  } catch (error) {
    next(error);
  }
});

// 로그인 api (아래는 /login 이지만, 실제로는 /api/login로 요청해야 함.)
userRouter.post("/login", async function (req, res, next) {
  console.log("로그인 라우터에 오신걸 환영합니다!!");
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
    const { email, password } = req.body;
    console.log(req.body);
    // 어드민 로그인
    if (email === "admin@hugging.com" && password === "123123123") {
      const { token, refreshToken } = await userService.adminLogin({
        email,
        password,
      });
      return res.status(200).json({
        status: 200,
        msg: "관리자 계정 로그인",
        token,
        refreshToken,
      });
    }
    // req (request) 에서 데이터 가져오기

    // 로그인 진행 (로그인 성공 시 AT , RT 보내줌)
    const { token, refreshToken } = await userService.getUserToken({
      email,
      password,
    });

    // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
    res.status(200).json({
      token,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
});

// 전체 유저 목록을 가져옴 (배열 형태임)
// 미들웨어로 loginRequired 를 썼음 (이로써, jwt 토큰이 없으면 사용 불가한 라우팅이 됨)
userRouter.get(
  "/userlist",
  // loginRequired,
  async function (req, res, next) {
    console.log("전체유저조회 라우터에 오신걸 환영합니다!!");
    try {
      // 전체 사용자 목록을 얻음
      const users = await userService.getUsers(); // =>let returns =  [{name}{name}{name}{}{}{}{}]
      // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
      return res.status(200).json({
        stauts: 200,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get("/mypage", loginRequired, async (req, res, next) => {
  console.log("마이페이지 라우터에 오신걸 환영합니다!!");
  const { currentRole, currentUserId, currentSosial } = req;
  try {
    if (currentRole === "user") {
      // 마이페이지 데이터 리턴
      const user = await userService.mypage(currentUserId);
      return res.status(200).json({
        status: 200,
        msg: `${user.name}의 마이페이지`,
        name: user.name,
        data: user,
        sosial: user.sosial,
        url: "/mypage",
      });
    } else if (req.currentRole === "admin") {
      console.log("들어옴?");
      return res.status(200).json({
        msg: "관리자",
        url: "/admin",
      });
    }
  } catch (err) {
    next(err);
  }
});

// 사용자 정보 수정
// (예를 들어 /api/users/abc12345 로 요청하면 req.params.userId는 'abc12345' 문자열로 됨)
userRouter.patch("/", loginRequired, async function (req, res, next) {
  console.log("개인정보수정 라우터에 오신걸 환영합니다!!");
  const { currentUserId } = req;
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // jwt로부터 user id 가져옴
    const userId = currentUserId;
    const sosial = req.currentSosial;
    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const name = req.body.name;
    const password = req.body.password;
    const address = req.body.address;
    const phoneNumber = req.body.phoneNumber;

    // body data로부터, 확인용으로 사용할 현재 비밀번호를 추출함.
    const currentPassword = req.body.currentPassword;

    // currentPassword 없을 시, 진행 불가
    // 단, 소셜로그인한 사람이라면 그냥 지나감
    if (sosial === true) {
      console.log("소셜로그인인 사람임");
    } else if (!currentPassword) {
      throw new Error("정보를 변경하려면, 현재의 비밀번호가 필요합니다.");
    }

    const userInfoRequired = { userId, currentPassword, sosial };
    console.log(userId);
    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(name && { name }),
      ...(password && { password }),
      ...(address && { address }),
      ...(phoneNumber && { phoneNumber }),
    }; //

    // 사용자 정보를 업데이트함.
    const updatedUserInfo = await userService.setUser(
      userInfoRequired,
      toUpdate
    );

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json({
      status: 200,
      msg: "수정완료",
    });
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/", loginRequired, async (req, res, next) => {
  console.log("회원탈퇴 라우터에 오신걸 환영합니다!!");
  const { currentUserId, currentRole } = req;
  const { accept } = req.body;
  console.log(req.body);
  if (is.emptyObject(req.body)) {
    throw new Error("탈퇴하고 싶지 않으시군요~?");
  }

  if (!accept === "탈퇴") {
    throw new Error("탈퇴하고 싶지 않으시군요~?");
  }
  if (currentRole === "admin") {
    throw new Error("탈퇴하고 싶지 않으시군요~?");
  }
  if (accept === "탈퇴") {
    try {
      const result = await userService.userDelete(currentUserId);
      return res.status(200).json({
        status: 200,
        msg: result,
      });
    } catch (err) {
      next(err);
    }
  }
});

userRouter.get("/grades", loginRequired, async (req, res, next) => {
  console.log("등급 구분 라우터");
  const { currentUserId } = req;
  console.log("지금 여기에 찍히고 있는지 확인 " + currentUserId);
  try {
    const result = await userService.classification(currentUserId);
    let grade;
    if (result <= 50000) {
      grade = "Bronze";
    } else if (result > 50000 && result <= 250000) {
      grade = "Silver";
    } else if (result > 250000 && result <= 1000000) {
      grade = "Gold";
    } else if (result > 1000000) {
      grade = "Diamond";
    }
    console.log(grade);
    return res.status(201).json({
      status: 201,
      level: grade,
    });
  } catch (err) {
    next(err);
  }
});

export { userRouter };
