import * as Api from "/api.js";
import { validateEmail } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const submitButton = document.querySelector("#submitButton");
const submitKaKaoButton = document.querySelector("#submitKaKaoButton");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener("click", handleSubmit);
  submitKaKaoButton.addEventListener("click", handleKaKaoSubmit);
}

async function handleKaKaoSubmit(e) {
  e.preventDefault();
  try {
    localStorage.setItem("sosial", "kakao");
    const goUrl = await Api.get("/api/sosial/kakao");
    window.location.href = goUrl.url;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 로그인 진행
async function handleSubmit(e) {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  // 잘 입력했는지 확인
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;

  if (!isEmailValid || !isPasswordValid) {
    return alert("이메일과 비멀번호를 확인해주세요.");
  }

  // 로그인 api 요청
  try {
    const data = { email, password };

    const result = await Api.post("/api/users/login", data);
    const token = result.token;
    const refreshToken = result.refreshToken;
    console.log(token);
    console.log(refreshToken);
    // 로그인 성공, 토큰을 세션 스토리지에 저장
    // 물론 다른 스토리지여도 됨
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("loggedIn", "true");
    // 기본 페이지로 이동
    window.location.href = "/";
    alert(`로그인되었습니다.`);

    // 로그인 성공
  } catch (err) {
    console.error(err.stack);
  }
}
