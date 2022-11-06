import * as Api from "/api.js";
const list_mom = document.getElementById("list_mom");
const signOut = document.getElementById("signOut");

// 회원탈퇴 폼을 제공해주는 함수
const createForm = async () => {
  while (list_mom.hasChildNodes()) {
    list_mom.removeChild(list_mom.firstChild);
  }
  list_mom.className = "holder_center";
  const clicked_title = document.getElementById("clicked_title");
  const clicked_descript = document.getElementById("clicked_descript");
  clicked_title.textContent = "회원탈퇴";
  clicked_descript.textContent = "회원탈퇴 제출 폼";
  const form = document.createElement("form");
  form.id = "signOut_form";
  form.className = "signOut_form";
  form.innerHTML = `
    <small>'탈퇴' 입력후 제출</small>
    <input
        type="text"
        id="signout_accept"
        placeholder="'탈퇴'입력"
    />
 
    <br>
    <br>
    <div>
      <a id="canCel">취소</a>
      <input type="submit" value="제출" />
    </div>
    `;

  list_mom.appendChild(form);
  const signOut_form = document.getElementById("signOut_form");
  signOut_form.addEventListener("submit", submitFrom);
  if (document.getElementById("canCel")) {
    document.getElementById("canCel").addEventListener("click", () => {
      canCel();
    });
  }
  console.log("회원탈퇴 폼 생성");
};

signOut.addEventListener("click", createForm);
function canCel() {
  setTimeout(() => {
    while (list_mom.hasChildNodes()) {
      list_mom.removeChild(list_mom.firstChild);
    }
  }, 1);
  list_mom.className = "";
  const clicked_title = document.getElementById("clicked_title");
  const clicked_descript = document.getElementById("clicked_descript");
  clicked_title.textContent = "";
  clicked_descript.textContent = "";
}

const submitFrom = async (e) => {
  e.preventDefault();
  if (
    confirm("정말 탈퇴하시겠습니까? \n 탈퇴시 모든 정보는 복구가 불가능합니다.")
  ) {
    const body = { accept: document.getElementById("signout_accept").value };
    const res = await Api.delete("/api/users", "", body);
    console.log(res);
    sessionStorage.clear();
    alert("그동안 감사했습니다.");
    window.location.href = "/";
    return;
  }
  alert("휴 다행이에요~ ");
};
