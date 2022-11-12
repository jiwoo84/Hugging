import * as Api from "/api.js";
const findPw = document.getElementById("findPw");
const findwPwForm = document.getElementById("findwPwForm");
const findpw_box = document.getElementById("findpw_box");
const autnNum = document.getElementById("autnNum");
const authEmail = document.getElementById("authEmail");
const authEmailBtn = document.getElementById("authEmailBtn");
const newpwInput = document.getElementById("newpwInput");
const newPw = document.getElementById("newPw");
const newpwSubmit = document.getElementById("newpwSubmit");

const makeForm = async () => {
  console.log("들어옴");
  findpw_box.className = "";
  findwPwForm.innerHTML = `
        <h2 id="exit">❌</h2>
        <input placeholder="가입한 이메일을 입력해주세요" id="findPwInput"/>
        <button id="submitBtn">이메일 인증</button>
    `;
  const exit = document.getElementById("exit");
  exit.addEventListener("click", () => {
    findpw_box.className = "hidden";
    autnNum.className = "hidden";
    newPw.className = "hidden";
  });
  const findPwInput = document.getElementById("findPwInput");
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.addEventListener("click", emailAuth);
  const authInput = document.createElement("input");
  authInput.placeholder;
};
const emailAuth = async () => {
  // 아래로 요청시 data에 true 값이 담겨나옴
  const auth = await Api.post("/api/users/email", { email: findPwInput.value });
  sessionStorage.setItem("emailAuth", auth.data);
  sessionStorage.setItem("emaulAuthNum", auth.auth);
  alert(auth.msg);
  autnNum.className = "";
};

const email_auth = async () => {
  if (authEmail.value !== sessionStorage.getItem("emaulAuthNum")) {
    return alert("인증번호가 맞지 않습니다.");
  }
  // hidden 숨기기
  newPw.className = "";
  alert("인증 성공");
  newpwSubmit.addEventListener("click", async () => {
    const aa = await Api.patch(
      `/api/users`,
      `${sessionStorage.getItem("emailAuth")}`,
      { newPw: newpwInput.value }
    );
    alert("비밀번호가 변경되었습니다.");
    findpw_box.className = "hidden";
    autnNum.className = "hidden";
    newPw.className = "hidden";
  });
};
authEmailBtn.addEventListener("click", email_auth);
findPw.addEventListener("click", makeForm);
