import express from "express";
import is from "@sindresorhus/is";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from "../middlewares";
import { userService } from "../services";
import { itemService } from "../services/item-service";

const userRouter = express();
// jwt 검증만 하는 라우터
userRouter.get("/authority", (req, res) => {
  console.log("jwt검증 라우터에 오신걸 환영합니다!!");
  const userToken = req.headers["authorization"]?.split(" ")[1];
  if (!userToken) {
    return res.status(400).json({
      status: 200,
      msg: "토큰이 없어요, 이 창구는 권한 및 로그인 체크하는 곳입니다.\n토큰발급후 시도해주세요",
    });
  }
  try {
    const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
    const jwtDecoded = jwt.verify(userToken, secretKey);
    const { role, sosial } = jwtDecoded;
    return res.status(200).json({
      status: 200,
      authority: `${role}`,
      sosial: `${sosial}`,
    });
  } catch (error) {
    res.status(403).json({
      result: "forbidden-approach",
      msg: "정상적인 토큰이 아닙니다.",
    });
    return;
  }
});

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
      const adminToken = await userService.adminLogin({ email, password });
      return res.status(200).json({
        status: 200,
        msg: "관리자 계정 로그인",
        accessToken: adminToken,
      });
    }
    // req (request) 에서 데이터 가져오기

    // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
    const userToken = await userService.getUserToken({ email, password });

    // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
    res.status(200).json({
      accessToken: userToken,
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

export { userRouter };
