import * as Api from "/api.js";
// 구글 로그인

// 아래 도메인 변경시 각 소셜REST API 콘솔에서 리다이렉트 url도 바꿔줘야함.
const MY_DOMAIN = "http://http://34.64.162.140//";
// 아래 구글로그인은 다른 프로젝트에서 쓰던 코드. 구글로그인 추가시 수정하여 사용
// const login__google = async () => {
//   const code = new URL(window.location.href).searchParams.get("code");
//   console.log(code);
//   console.log("google");
//   await $.ajax({
//     url: `https://wetube-jinytree.herokuapp.com/2eum/auth/google/callback?code=${code}`,
//     type: "GET",
//     success: function (res) {
//       localStorage.setItem("token", `${res.data.access_token}`);
//       location.href = "/";
//     },
//   });
// };

// 카카오 로그인
//이 페이지에 잘 도착했다면 코드를 받아왔을것임
// 그 코드에 대한 권한을 보기위한 HTTP 통신
const login__kakao = async () => {
  const code = { code: new URL(window.location.href).searchParams.get("code") };
  console.log(code);
  const access_token = await Api.post(
    `${MY_DOMAIN}api/sosial/kakao/oauth`,
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
  sessionStorage.setItem("loggedIn", "true");
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

window.addEventListener("load", loginStart);
