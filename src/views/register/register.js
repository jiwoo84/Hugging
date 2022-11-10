import * as Api from "/api.js";
import { validateEmail } from "/useful-functions.js";
import { findAddress } from "./findAddress.js";

// 요소(element), input 혹은 상수
const fullNameInput = document.querySelector("#fullNameInput");
const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const passwordConfirmInput = document.querySelector("#passwordConfirmInput");
const phoneNumberInput = document.querySelector("#phoneNumberInput");
const postalCodeInput = document.querySelector("#postalCodeInput");
const address1Input = document.querySelector("#address1Input");
const address2Input = document.querySelector("#address2Input");
const findAddressBtn = document.querySelector("#findAddressBtn");
const submitButton = document.querySelector("#submitButton");

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener("click", handleSubmit);
  findAddressBtn.addEventListener("click", findAddress);
}

// 회원가입 진행
async function handleSubmit(e) {
  e.preventDefault();

  const name = fullNameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;
  const phoneNumber = phoneNumberInput.value;
  const postalCode = postalCodeInput.value;
  const address1 = address1Input.value;
  const address2 = address2Input.value;

  const address = `(${postalCode})${address1} ${address2}`;

  // 잘 입력했는지 확인
  const isFullNameValid = name.length >= 2;
  const isEmailValid = validateEmail(email);
  //비밀번호
  const num = password.search(/[0-9]/g);
  const eng = password.search(/[a-z]/gi);
  const spe = password.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
  const isPasswordSame = password === passwordConfirm;
  //폰번호
  const phoneNum = /01[016789]-[^0][0-9]{2,3}-[0-9]{3,4}/;
  const isphoneNumber = phoneNum.test(phoneNumber);
  // 주소
  if (!postalCode || !address2Input.value) {
    return alert("배송지 정보를 모두 입력해 주세요.");
  }

  if (!isFullNameValid) {
    return alert("이름은 2글자 이상 입력해주세요.");
  }

  if (!isEmailValid) {
    return alert("이메일을 다시 확인해주세요.");
  }

  if (password.length < 8 || password.length > 20) {
    return alert("8자리 이상 20자리 이내로 입력해주세요.");
  } else if (password.search(/\s/) != -1) {
    return alert("비밀번호는 공백 없이 입력해주세요.");
  } else if (num < 0 || eng < 0 || spe < 0) {
    return alert("영문,숫자, 특수문자를 혼합하여 입력해주세요.");
  }

  if (!isPasswordSame) {
    return alert("비밀번호가 일치하지 않습니다.");
  }
  if (!isphoneNumber) {
    return alert("핸드폰 번호를 확인 해주세요.");
  }

  // 회원가입 api 요청
  try {
    const data = { name, email, password, phoneNumber, address };

    await Api.post("/api/users/join", data);

    alert(`정상적으로 회원가입되었습니다.`);

    // 로그인 페이지 이동
    window.location.href = "/login";
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
