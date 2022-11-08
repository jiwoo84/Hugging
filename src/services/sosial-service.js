import axios from "axios";
import { User } from "../db";
import { userService } from "./user-service";
import bcrypt from "bcrypt";
class SosialService {
  // 본 파일의 맨 아래에서, new ItemService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor() {}
  // 카카오로 회원가입되는 함수

  // 동의항목 동의 창입력,
  async kakaoStart() {
    const baseUrl = "https://kauth.kakao.com/oauth/authorize?";
    const config = {
      client_id: process.env.KAKAO_KEY,
      redirect_uri:
        process.env.KAKAO_REDIRECT || "http://localhost:5000/sosial",
      response_type: "code",
      scope: "profile_nickname,profile_image,account_email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}${params}`;
    console.log(finalUrl);
    console.log("🔥 동의항목 끝냈고, 이제 파이널 url 갈거야");
    return finalUrl;
  }

  // code값에대한 액세스토큰을 받아서 리턴하는 서비스로직
  async kakaoGetToken(code) {
    // 이전단계에서 동의항목 체크후 정상적으로 redirect 되면 시작되는 로직
    const baseUrl = "https://kauth.kakao.com/oauth/token";
    const config = {
      grant_type: "authorization_code",
      client_id: process.env.KAKAO_KEY,
      redirect_uri:
        process.env.KAKAO_REDIRECT || "http://localhost:5000/sosial",
      client_secret: process.env.KAKAO_SECRET,
      code, // 매개변수로 얻어온 코드
    };
    // params 라는 이름으로 config객체를  URLSearchParams를통해 만듬
    // 자동으로 ?grant_tpe=~&client_id=#$ 요런식으로 바꿔주는 메서드인듯함.
    const params = new URLSearchParams(config).toString();

    // axios 로 베이스url 로 위에서 만든 params 를 보내고, 헤더에 아래 값을 넣어서 보낸다.
    // 만약 유효한 code를 얻었었다면 axios 요청이 axiosHTTP 변수에 담긴다.
    const axiosHTTP = await axios.post(baseUrl, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    // 해당 변수를 확인해보면 data 안에 access_token 이 있는것을 확인할 수 있다.
    // 해당 access_token 을 적절한 변수명에 저장해준다.
    const access_token = axiosHTTP.data.access_token;
    return access_token;

    // access_token 이 존재한다면

    // 먼길 왔다.
    // 여기서부턴 37번라인에서 액세스토큰이 존재하지 않을때임!
  }
  async kakaoFinish(access_token) {
    const apiUrl = "https://kapi.kakao.com/v2/user/me";
    const profile = await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!profile.data.kakao_account.email) {
      throw new Error("이메일 항목 동의 하셔야합니다.");
    }
    const email = profile.data.kakao_account.email;
    const name = profile.data.properties.nickname;
    const avatarUrl = profile.data.properties.profile_image; //나중에 프로필필요할때
    const password = "123123123";
    const user = await User.findOne({ email });
    if (user) {
      const token = await userService.getUserToken({ email, password });
      return { msg: "기존 사용자, 로그인 완료", accessToken: token };
    }
    // 해당 이메일로 가입한 유저가 없을 경우
    else {
      // 아래 로직은 혹시모를 이름 중복을 막기위해
      // 이진희_1, _2 이런식으로 추가하는 로직
      let nickCheck = await User.findOne({
        //원래 있었다면
        name,
      });
      console.log("닉네임 존재 여부, false=존재 : ", !nickCheck);
      let nickname = name;
      let num = 0;
      // 해당 사용자가 존재한다면
      if (nickCheck) {
        while (!nickCheck) {
          // 여기서 null 또는 언디파인으로 바뀜
          nickCheck = await User.findOne({
            nickname: nickname + "_" + String(num),
          });
          console.log("닉네임 존재 여부, false=존재 : ", !nickCheck);
          ++num;
          console.log("🔥 닉네임 중복을 피하는중...");
        }
        console.log(
          "🔥 없는 닉네임 찾았다!! ->" + nickname + "_" + String(num)
        );
        nickname = nickname + "_" + String(num);
        //최종 닉네임!
        console.log(nickname);
      }
      const hashedPassword = await bcrypt.hash("123123123", 10);
      const userInfo = {
        name,
        email,
        phoneNumber: "번호를 수정해주세요",
        address: "주소를 수정해주세요.",
        sosial: true,
        password: hashedPassword,
      };
      const joinSeccess = await User.create(userInfo);
      if (joinSeccess) {
        console.log("✅ 카카오데이터로 회원가입 완료!");
        const loginData = { email: joinSeccess.email, password: "123123123" };
        const token = await userService.getUserToken(loginData);
        return { msg: "카카오 회원가입 및 로그인 완료", accessToken: token };
      }
    }
  }
}

const sosialService = new SosialService();

export { sosialService };
