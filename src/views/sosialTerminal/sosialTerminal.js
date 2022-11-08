// 구글 로그인
import * as Api from "../api";

// 아래 도메인 변경시 각 소셜REST API 콘솔에서 리다이렉트 url도 바꿔줘야함.
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
