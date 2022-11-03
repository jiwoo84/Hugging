import * as Api from "/api.js";
// 구글 로그인
const MY_DOMAIN = "http://localhost:5000";
const login__google = async () => {
  const code = new URL(window.location.href).searchParams.get("code");
  console.log(code);
  console.log("google");
  await $.ajax({
    url: `https://wetube-jinytree.herokuapp.com/2eum/auth/google/callback?code=${code}`,
    type: "GET",
    success: function (res) {
      localStorage.setItem("token", `${res.data.access_token}`);
      location.href = "/";
    },
  });
};

// 카카오 로그인
//이 페이지에 잘 도착했다면 코드를 받아왔을것임
// 그 코드에 대한 권한을 보기위한 HTTP 통신
const login__kakao = async () => {
  const code = { code: new URL(window.location.href).searchParams.get("code") };
  const access_token = await Api.post(
    `${MY_DOMAIN}/api/sosial/kakao/oauth`,
    code
  );
  console.log(access_token);
  sessionStorage.setItem("access_token", access_token.accessToken);
};
const kakao_finish = async () => {
  const access_token = sessionStorage.getItem("access_token");
  console.log(access_token);
  console.log("피니시 시작!!");
  const body = { access_token };
  const result = await Api.post(`${MY_DOMAIN}/api/sosial/kakao`, body);
  sessionStorage.setItem("token", result.accessToken);
  alert("카카오 로그인 완료");
  window.location.href = "/";
};

const loginStart = async () => {
  if (localStorage.getItem("sosial") === "google") {
    await login__google();
  } else if (localStorage.getItem("sosial") === "kakao") {
    await login__kakao();
    await kakao_finish();
  }
};

window.addEventListener("load", loginStart);
