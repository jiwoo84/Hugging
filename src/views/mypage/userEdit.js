import * as Api from "/api.js";
import { findAddress } from "./findAddress.js";

const list_mom = document.getElementById("list_mom");
const userEdit = document.getElementById("userEdit");

userEdit.addEventListener("click", createEditForm);

// 회원탈퇴 폼을 제공해주는 함수
async function createEditForm() {
  console.log("??왜 들어오지도 못하냐");
  const user = await Api.get("/api/users/mypage");
  console.log(user);

  list_mom.innerHTML = "";
  list_mom.className = "holder_center";
  const clicked_title = document.getElementById("clicked_title");
  const clicked_descript = document.getElementById("clicked_descript");
  clicked_title.textContent = "";
  clicked_descript.textContent = "";

  const form = document.createElement("div");
  form.id = "userEdit_form";
  form.className = "signOut_form";
  form.innerHTML = `
    <h1>정보 수정</h1>
    <small>빈칸 제출시 해당값은 수정되지 않습니다</small>
    <div id="nameBox">
      <p>이름</p>
      <input
        type="text"
        id="name"
        placeholder="${user.data.name}"
      />
    </div>
    <div id="passwordBox">
      <p>비밀번호</p>
      <input
        type="password"
        id="password"
        placeholder="변경될 비밀번호"
      />
    </div>
    <div id="phoneNumberBox">
    <p>전화번호</p>
      <input
        type="text"
        id="phoneNumber"
        placeholder="${user.data.phoneNumber}"
      />
    </div>
    <p>주소</p>
    <div id="addressBox">
      <input
        type="text"
        id="addressInput1"
        placeholder="${user.data.address}"
      />
      <input
        type="text"
        id="addressInput2"
      />
      <button id="addressBox_changeBtn">주소 변경</button>
    </div>
    <br>
    
    <p>비밀번호 확인</p>
    <small>수정을 위해 기존 비밀번호를 입력하세요</small>
    <input
        type="password"
        id="currentPassword"
        placeholder="소셜가입고객은 미입력"
    />

    <br>
    <br>
    <div>
      <button id="modifyDoneBtn">수정완료</button>
      <button id="canCel">취소</button>
    </div>
    `;

  list_mom.appendChild(form);

  // 주소 변경 버튼
  const addressBox_changeBtn = document.querySelector("#addressBox_changeBtn");
  addressBox_changeBtn.addEventListener("click", clickAddress);

  // 수정완료,취소에 이벤트 추가
  const userEdit_form = document.getElementById("userEdit_form");
  const modifyDoneBtn = document.getElementById("modifyDoneBtn");
  modifyDoneBtn.addEventListener("click", submitFrom);
  if (document.getElementById("canCel")) {
    document.getElementById("canCel").addEventListener("click", canCel);
  }
  console.log("정보변경 툴 생성");
}

// 취소버튼 함수
function canCel() {
  setTimeout(() => {
    while (list_mom.hasChildNodes()) {
      list_mom.removeChild(list_mom.firstChild);
    }
  }, 1);
  list_mom.className = "";
}

// 수정완료 버튼 함수
const submitFrom = async (e) => {
  e.preventDefault();
  const phoneNumber = document.getElementById("phoneNumber").value;
  const name = document.getElementById("name").value;
  const address1 = document.getElementById("addressInput1").value;
  const address2 = document.getElementById("addressInput2").value;
  const address = address1 + address2;
  const password = document.getElementById("password").value;
  const currentPassword = document.getElementById("currentPassword").value;

  console.log(address);

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

// 주소 변경 버튼
function clickAddress() {
  // input을 여기서 받아야 함(findAddress파일에서 찾으면 안 잡힘)
  const addressInput1 = document.querySelector("#addressInput1");
  const addressInput2 = document.querySelector("#addressInput2");

  findAddress();
}
