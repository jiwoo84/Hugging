import * as Api from "/api.js";
const list_mom = document.getElementById("list_mom");
const userEdit = document.getElementById("userEdit");

// 회원탈퇴 폼을 제공해주는 함수
const createEditForm = async () => {
  console.log("??왜 들어오지도 못하냐");
  const user = await Api.get("/api/users/mypage");
  console.log(user);
  while (list_mom.hasChildNodes()) {
    list_mom.removeChild(list_mom.firstChild);
  }
  list_mom.className = "holder_center";
  const clicked_title = document.getElementById("clicked_title");
  const clicked_descript = document.getElementById("clicked_descript");
  clicked_title.textContent = "회원탈퇴";
  clicked_descript.textContent = "회원탈퇴 제출 폼";
  const form = document.createElement("form");
  form.id = "userEdit_form";
  form.className = "signOut_form";
  form.innerHTML = `
    <small>원하는 변경사항을 입력후 제출하세요.</small>
    <small>빈칸 제출시 해당값은 수정되지 않습니다</small>
    <input
        type="text"
        id="name"
        placeholder="기존 : ${user.data.name}"
    />
    <input
        type="password"
        id="password"
        placeholder="변경될 비밀번호"
    />
    <input
        type="text"
        id="address"
        placeholder="기존 : ${user.data.address}"
    />
    <input
        type="text"
        id="phoneNumber"
        placeholder="기존 : ${user.data.phoneNumber}"
    />
    <br>
    <small>진행을 위해 기존 비밀번호를 입력해주세요</small>
    <input
        type="text"
        id="currentPassword"
        placeholder="소셜가입고객은 미입력"
    />
 
    <br>
    <br>
    <div>
      <a id="canCel">취소</a>
      <input type="submit" value="제출" />
    </div>
    `;
  list_mom.appendChild(form);
  const userEdit_form = document.getElementById("userEdit_form");
  userEdit_form.addEventListener("submit", submitFrom);
  if (document.getElementById("canCel")) {
    document.getElementById("canCel").addEventListener("click", () => {
      canCel();
    });
  }
  console.log("정보변경 툴 생성");
};
userEdit.addEventListener("click", createEditForm);

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
  const phoneNumber = document.getElementById("phoneNumber").value;
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const password = document.getElementById("password").value;
  const currentPassword = document.getElementById("currentPassword").value;
  const body = {
    phoneNumber,
    name,
    address,
    password,
    currentPassword,
  };
  const res = await Api.patch("/api/users", "", body);
  if (res.status === 200 && res.msg === "수정완료") {
    alert(`정보 수정 완료!`);
    window.location.reload();
    return;
  }
  alert(res.msg);
  //   window.location.href = "/";
};
