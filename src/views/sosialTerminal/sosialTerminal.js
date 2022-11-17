import * as Api from "api.js";
console.log("들어옴~");
const login__kakao = async () => {
  console.log("카카오 로그인 시작");
  const code = { code: new URL(window.location.href).searchParams.get("code") };
  console.log(code);
  const access_token = await Api.post(`/hugging/api/sosial/kakao/oauth`, code);
  console.log(access_token);
  sessionStorage.setItem("access_token", access_token.accessToken);
};
const kakao_finish = async () => {
  const access_token = sessionStorage.getItem("access_token");
  console.log(access_token);
  console.log("피니시 시작!!");
  const body = { access_token };
  const result = await Api.post(`/hugging/api/sosial/kakao`, body);
  console.log(result);
  localStorage.setItem("token", result.token);
  localStorage.setItem("refreshToken", result.refreshToken);
  localStorage.setItem("loggedIn", "true");
  localStorage.removeItem("sosial");
  sessionStorage.removeItem("access_token");
  alert("카카오 로그인 완료");
  window.location.href = "/";
};

// 이 창으로 왔을때 바로 실행됨
// 구글로그인이라면 구글 로그인 로직을, 카카오라면 카카오로직을 실행
const loginStart = async () => {
  console.log("꿈적도안하네");
  console.log("안볐다~");
  if (localStorage.getItem("sosial") === "google") {
    await login__google();
  } else if (localStorage.getItem("sosial") === "kakao") {
    console.log("카카오");
    await login__kakao();
    await kakao_finish();
  }
  console.log("볏다~~");
};
window.addEventListener("load", loginStart);
