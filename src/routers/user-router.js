import express from "express";
import is from "@sindresorhus/is";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from "../middlewares";
import { userService } from "../services";
import { itemService } from "../services/item-service";

const userRouter = express();

// 회원가입 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
userRouter.post("/join", async (req, res, next) => {
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
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// 로그인 api (아래는 /login 이지만, 실제로는 /api/login로 요청해야 함.)
userRouter.post("/login", async function (req, res, next) {
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
  const { currentRole, currentUserId, currentSosial } = req;
  if (currentRole === "user" || currentRole === "admin") {
    // 마이페이지 데이터 리턴
    const user = await userService.mypage(currentUserId);
    return res.status(200).json({
      status: 200,
      msg: `${user.name}의 마이페이지`,
      name: user.name,
      data: user,
      sosial: user.sosial,
    });
  } else if (req.currentRole === "admin") {
    // 관리자페이지 이동
  }
});

// 사용자 정보 수정
// (예를 들어 /api/users/abc12345 로 요청하면 req.params.userId는 'abc12345' 문자열로 됨)
userRouter.patch("/", loginRequired, async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // jwt로부터 user id 가져옴
    const userId = req.curretUserId;
    const sosial = req.currentSosial;
    console.log(typeof sosial);
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
    res.status(200).json(updatedUserInfo);
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/", loginRequired, async (req, res, next) => {
  const { currentUserId, currentRole } = req;
  const { accept } = req.body;
  if (!accept === "탈퇴") {
    return res.status(400).json({
      msg: "탈퇴하고싶지 않으시군요 ?ㅎㅎ",
    });
  }
  if (currentRole === "admin") {
    return res.status(400).json({
      msg: "어딜 도망가려고, 관리자는 탈퇴 못함",
    });
  }
  try {
    const result = await userService.userDelete(currentUserId);
    return res.status(200).json({
      status: 200,
      msg: result,
    });
  } catch (err) {
    next(err);
  }
});

export { userRouter };
