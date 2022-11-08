import * as Api from "/api.js";
const login__kakao = async () => {
  console.log("카카오 로그인 시작");
  const code = { code: new URL(window.location.href).searchParams.get("code") };
  console.log(code);
  const access_token = await Api.post(`/api/sosial/kakao/oauth`, code);
  console.log(access_token);
  sessionStorage.setItem("access_token", access_token.accessToken);
};
const kakao_finish = async () => {
  const access_token = sessionStorage.getItem("access_token");
  console.log(access_token);
  console.log("피니시 시작!!");
  const body = { access_token };
  const result = await Api.post(`/api/sosial/kakao`, body);
  sessionStorage.setItem("token", result.accessToken);
  sessionStorage.setItem("loggedIn", "true");
  localStorage.removeItem("sosial");
  sessionStorage.removeItem("access_token");
  alert("카카오 로그인 완료");
  window.location.href = "/";
};

// 이 창으로 왔을때 바로 실행됨
// 구글로그인이라면 구글 로그인 로직을, 카카오라면 카카오로직을 실행
const loginStart = async () => {
  if (localStorage.getItem("sosial") === "google") {
    await login__google();
  } else if (localStorage.getItem("sosial") === "kakao") {
    await login__kakao();
    await kakao_finish();
  }
};
if (localStorage.getItem("sosial" !== null)) {
  window.addEventListener("load", loginStart);
}
