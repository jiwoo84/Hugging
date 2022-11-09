import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Coupon, User } from "../db";
import { couponRouter } from "../routers";

class UserService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor() {}

  // 회원가입 (admin 가입시 이름끝에 _admin 붙이기)
  async addUser(userInfo) {
    // 객체 destructuring
    const { email, name, password, address, phoneNumber } = userInfo;
    // 이메일 중복 확인
    const user = await User.findOne({ email });
    if (user) {
      throw new Error(
        "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요."
      );
    }

    // 이메일 중복은 이제 아니므로, 회원가입을 진행함

    // 우선 비밀번호 해쉬화(암호화)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("여ㅑ기?");
    const newUserInfo = {
      name,
      email,
      password: hashedPassword,
      address,
      phoneNumber,
    };
    // db에 저장
    // 일반적인 가입
    const createdNewUser = await User.create(newUserInfo);

    //첫회원가입쿠폰 추가
    const createFirstcoupon = await Coupon.create({
      name: "첫 회원가입 기념 쿠폰",
      discount: 10,
      owner: createdNewUser.id,
    });
    console.log("아따 여기 쿠폰 발급됐다 아인교" + createFirstcoupon);
    const pushFristCoupon = await User.findByIdAndUpdate(
      { _id: createFirstcoupon.owner },
      { $push: { ownCoupons: createFirstcoupon.id } }
    );
    const login = this.getUserToken({ email, password });
    return login;
  }

  // 로그인
  async getUserToken(loginInfo) {
    // 객체 destructuring
    const { email, password } = loginInfo;

    // 우선 해당 이메일의 사용자 정보가  db에 존재하는지 확인
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요."
      );
    }

    // 이제 이메일은 문제 없는 경우이므로, 비밀번호를 확인함

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password; // db에 저장되어 있는 암호화된 비밀번호

    // 매개변수의 순서 중요 (1번째는 프론트가 보내온 비밀번호, 2번쨰는 db에 있떤 암호화된 비밀번호)
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Error(
        "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
      );
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY;

    // AT, RT 를 만들어 리턴함
    const token = jwt.sign(
      { userId: user._id, role: user.role, sosial: user.sosial },
      secretKey,
      { expiresIn: 60 * 60 }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role, sosial: user.sosial },
      secretKey,
      { expiresIn: 60 * 60 * 24 }
    );
    console.log("로그인 : AT, RT : ", token, refreshToken);
    // 리프레쉬 토큰을 유저정보에 넣음
    await User.findByIdAndUpdate(user._id, { refreshToken });
    return { token, refreshToken };
  }

  // RT 재발급
  async refresh(_id, refreshToken, reciveRt) {
    console.log("수정중");
    const security = await User.findOne({ refreshToken: reciveRt });
    console.log("기존 RT   = ", security.refreshToken);
    console.log("새로운 RT   = ", reciveRt);
    if (security.refreshToken !== reciveRt) {
      throw new Error("해당 RT는 당신소유가 아니잖아!!");
    }
    await User.findByIdAndUpdate(_id, { refreshToken });
    console.log("JWT RT 재발급수정완료!");
    return;
  }

  // 관리자 로그인
  async adminLogin(loginInfo) {
    const { email, password } = loginInfo;
    const secretKey = process.env.JWT_SECRET_KEY;
    const admin = await User.findOne({ email });
    if (!admin) {
      const newAdmin = await User.create({
        email,
        name: "관리자",
        password: "erboinerboiber",
        address: "엘리스 랩실",
        phoneNumber: "010-0000-0000",
        role: "admin",
      });
    }
    const token = jwt.sign({ userId: admin._id, role: "admin" }, secretKey, {
      expiresIn: 60 * 60,
    });
    const refreshToken = jwt.sign(
      { userId: admin._id, role: "admin" },
      secretKey,
      { expiresIn: 60 * 60 * 24 }
    );
    await User.updateOne({ email }, { refreshToken });
    return { refreshToken, token };
  }

  // 사용자 목록을 받음.
  async getUsers() {
    const users = await User.find({});
    return users;
  }
  // 마이페이지
  async mypage(id) {
    const user = await User.findById(id);
    return user;
  }
  // 유저정보 수정, 현재 비밀번호가 있어야 수정 가능함.
  async setUser(userInfoRequired, toUpdate) {
    // 객체 destructuring
    console.log("변경에필요한 사항 : ", userInfoRequired);
    console.log("변경할 내역들 : ", toUpdate);
    const { userId, currentPassword, sosial } = userInfoRequired;

    // 우선 해당 id의 유저가 db에 있는지 확인
    const user = await User.findById(userId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new Error("가입 내역이 없습니다. 다시 한 번 확인해 주세요.");
    }

    // 이제, 정보 수정을 위해 사용자가 입력한 비밀번호가 올바른 값인지 확인해야 함

    // 기존비밀번호 일치 여부 확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash
    );

    //소셜로그인 대상자라면 현재비밀번호는 중요하지않음, 통과
    if (sosial === true) {
      console.log("소셜로그인 대상자임, 통과");
    } else if (!isPasswordCorrect) {
      throw new Error(
        "현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
      );
    }

    // *********************이제 드디어 업데이트 시작****************************

    // 비밀번호도 변경하는 경우에는, 회원가입 때처럼 해쉬화 해주어야 함.
    // 소셜로그인 대상자도 비번 변경이 있다면 가능하게 함.
    const { password } = toUpdate;

    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
    }

    // 업데이트 진행
    const updateUser = await User.updateOne({ _id: userId }, toUpdate);
    return updateUser;
  }

  async userDelete(_id) {
    await User.findByIdAndDelete(_id);
    console.log("유저가 떠났읍니다..");
    return "유저가 떠났읍니다..";
  }

  async classification(data) {
    const findUser = await User.findById({ _id: data });
    return findUser.totalPayAmount;
  }
}

const userService = new UserService();

export { userService };
