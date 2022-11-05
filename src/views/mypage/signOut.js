import * as Api from "/api.js";
const welcomeMessage = document.getElementById("welcomeMessage");
const signOut = document.getElementById("signOut");
const list_mom = document.getElementById("list_mom");

// 회원탈퇴 폼을 제공해주는 함수
const createForm = () => {
  while (list_mom.hasChildNodes()) {
    list_mom.removeChild(list_mom.firstChild);
  }
  const clicked_title = document.getElementById("clicked_title");
  const clicked_descript = document.getElementById("clicked_descript");
  clicked_title.textContent = "회원탈퇴";
  clicked_descript.textContent = "회원탈퇴 제출 폼";
  const form = document.createElement("form");
  form.id = "signOut_form";
  form.className = "signOut_form";
  form.innerHTML = `
    <small>회원 탈퇴를 위하여 입력란에 '탈퇴'를 넣어주세요</small>
    <input
        type="text"
        id="signout_accept"
        placeholder="'탈퇴'를 입력해주세요"
    />
    <input type="submit" value="제출" />`;
  list_mom.appendChild(form);
  const signOut_form = document.getElementById("signOut_form");
  signOut_form.addEventListener("submit", submitFrom);
  console.log("회원탈퇴 폼 생성");
};

signOut.addEventListener("click", createForm);

const submitFrom = async (e) => {
  e.preventDefault();

  const body = { accept: document.getElementById("signout_accept").value };
  const res = await Api.delete("/api/users", "", body);
  sessionStorage.clear();
  alert("그동안 감사했습니다.");
  window.location.href = "/";
};
