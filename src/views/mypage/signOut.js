import * as Api from "/api.js";
const list_mom = document.getElementById("list_mom");
const signOut = document.getElementById("signOut");

signOut.addEventListener("click", createForm);

// 회원탈퇴 폼을 제공해주는 함수
async function createForm() {
  while (list_mom.hasChildNodes()) {
    list_mom.removeChild(list_mom.firstChild);
  }
  list_mom.className = "holder_center";
  const clicked_title = document.getElementById("clicked_title");
  const clicked_descript = document.getElementById("clicked_descript");
  clicked_title.textContent = "";
  clicked_descript.textContent = "";

  const form = document.createElement("div");
  form.id = "signOut_form";
  form.className = "signOut_form";
  form.innerHTML = `
    <p class="modal_title">탈퇴하기</p>
    <p class="modal_description">'탈퇴' 입력후 제출</p>
    <input
        type="text"
        id="signout_accept"
        class="input"
        placeholder="'탈퇴'입력"
    />
 
    <br>
    <br>
    <div>
    <button id="signout_btn" class="button">탈퇴하기</button>
    <button id="canCel" class="button">취소</button>
    </div>
    `;

  list_mom.appendChild(form);

  // 탈퇴 버튼
  const signout_btn = document.getElementById("signout_btn");
  signout_btn.addEventListener("click", submitFrom);

  // 취소버튼
  if (document.getElementById("canCel")) {
    document.getElementById("canCel").addEventListener("click", () => {
      canCel();
    });
  }
  console.log("회원탈퇴 폼 생성");
}

function canCel() {
  setTimeout(() => {
    while (list_mom.hasChildNodes()) {
      list_mom.removeChild(list_mom.firstChild);
    }
  }, 1);
  list_mom.className = "";
}

const submitFrom = async (e) => {
  e.preventDefault();

  const acceptMsg = document.getElementById("signout_accept").value;

  if (acceptMsg === "탈퇴") {
    if (
      confirm("정말 탈퇴하시겠습니까?\n탈퇴시 모든 정보는 복구가 불가능합니다.")
    ) {
      const body = { accept: acceptMsg };
      const res = await Api.delete("/api/users", "", body);
      console.log(res);
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      alert("탈퇴되었습니다.\n그동안 감사했습니다.");
      window.location.href = "/";
      return;
    }
  } else {
    alert("탈퇴를 원하시면 '탈퇴'를 입력해주세요");
  }
};
