import * as Api from "api.js";
// 관리자가 아니라면 튕겨내는 기능 구현 예정

// 화면이 들어가는 공간
const listContainer = document.querySelector("#list-container");
// 카테고리 관리 버튼
const categoryBtn = document.querySelector("#category-btn__management");
// 모달창
const categoryAddBox = document.querySelector("#modal-container");

// 버튼에 이벤트 넣기
categoryBtn.addEventListener("click", clickedCategory);

// *******************************************************************
// 카테고리 관리 버튼
async function clickedCategory() {
  // 화면 초기화 (모달창 지우거)
  categoryAddBox.innerHTML = "";

  // 사이드바: 상품관리 하단에 버튼 있다면 지우기
  const itemsBtn_add = document.querySelector("#items-btn__add");

  if (itemsBtn_add.innerText !== "") {
    itemsBtn_add.innerText = "";
  }

  // 주문관리의 페이지 있다면 지우기
  const page_list = document.querySelector("#page_list");
  if (page_list.innerHTML !== "") {
    page_list.innerHTML = "";
  }

  // 카테고리 추가 버튼 (없다면)넣기
  if (document.querySelector("#category-btn__add").innerText === "") {
    addCategory();
  }

  // 리스트 테이블 헤더 넣기
  listContainer.innerHTML = `
    <table class="table is-striped categoryTable">
      <thead>
        <tr>
          <th>카테고리명</th>
          <th>인덱스</th>
          <th>상품 개수</th>
        </tr>
      </thead>
      <tbody id="categoryBody">
      </tbody>
    </table>
  `;

  // 리스트 출력
  makeCategoryList();
}

// *******************************************************************
// 카테고리 추가 버튼
function addCategory() {
  // 버튼의 부모 불러오기
  const categoryBtnParent = document.querySelector("#category-btn");
  //추가할 버튼 생성
  const categoryBtn_add = document.querySelector("#category-btn__add");
  categoryBtn_add.innerText = "카테고리 추가";
  // 버튼을 부모에 추가
  categoryBtnParent.appendChild(categoryBtn_add);

  // 카테고리 추가 버튼 이벤트 -> 모달창 생성
  categoryBtn_add.addEventListener("click", async () => {
    categoryAddBox.innerHTML = `
    <div id="modal-container__inner">
      <p id="modalTitle">카테고리 추가</p>
      <div id="categoryAddBox_name">
        <p>이름</p>
        <input id="categoryAddBox_nameInput"/>
      </div>
      <div id="categoryAddBox_index">
        <p>인덱스</p>
        <input id="categoryAddBox_indexInput"/>
      </div>
      <div id="categoryAddBox_btns">
        <button id="categoryAddBox_addBtn" class="button is-dark">추가완료</button>
        <button id="categoryAddBox_cancelBtn" class="button is-dark">취소</button>
      </div>
      </div>
    `;

    // 추가완료 버튼
    const categoryAddBox_addBtn = document.querySelector(
      "#categoryAddBox_addBtn"
    );

    categoryAddBox_addBtn.addEventListener("click", async () => {
      // 입력받는 input 불러오기
      const categoryAddBox_nameInput = document.querySelector(
        "#categoryAddBox_nameInput"
      );
      const categoryAddBox_indexInput = document.querySelector(
        "#categoryAddBox_indexInput"
      );
      // 입력값 받아오기
      const addName = categoryAddBox_nameInput.value;
      const addIndex = categoryAddBox_indexInput.value;

      // 빈칸인지 검사
      if (addName === "" || addIndex === "") {
        return alert("값을 입력해주세요");
      }
      // 인덱스 형태 검사
      if (!/^[a-z|A-Z]/.test(addIndex)) {
        return alert(`인덱스는 알파벳으로 시작해야합니다. ex) a200, b300`);
      }
      // 검사를 통과했으면 요청 보냄
      const res = await categoryPost("/api/categories", {
        name: addName,
        index: addIndex,
      });

      alert(res.msg);
      // 모달창 없애기
      categoryAddBox.innerHTML = "";
      clickedCategory();
    });

    // 취소 버튼
    const categoryAddBox_cancelBtn = document.querySelector(
      "#categoryAddBox_cancelBtn"
    );

    categoryAddBox_cancelBtn.addEventListener("click", () => {
      categoryAddBox.innerHTML = "";
    });
  });
}

// *******************************************************************
// 카테고리 리스트 출력
async function makeCategoryList() {
  // 모든 카테고리 불러옴
  const categories = (await Api.get("/api/categories/all")).data;
  // 리스트가 들어갈 공간
  const categoryBody = document.querySelector("#categoryBody");

  // 각 행에 정보 넣어주기
  for (let data of categories) {
    // 해당 카테고리에 속한 자료 가져옴
    const categoryProductsCnt = (
      await Api.get(`/api/categories?name=${data.name}&index=${data.index}`)
    ).data.length;

    categoryBody.innerHTML += `
      <tr id=${data.index} class=${data.name}>
        <td class="categoryBody_row_nameContent">${data.name}</td>
        <td class="categoryBody_row_indexContent">${data.index}</td>
        <td class="categoryBody_row_cntContent">${categoryProductsCnt}</td>
        <td class="categoryBody_row_btns">
          <button class="categoryBody_row_btns_modify button is-dark">수정</button>
          <button class="categoryBody_row_btns_del button is-dark">삭제</button>
        </td>
      </tr>
    `;
  }
  // 삭제 버튼 구현
  delCategory();

  // 수정 버튼 구현
  modifyCategory();
}

// *******************************************************************
// 삭제 버튼 함수
function delCategory() {
  const categoryBody_row_btns_dels = document.querySelectorAll(
    ".categoryBody_row_btns_del"
  );

  categoryBody_row_btns_dels.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const index = btn.parentElement.parentElement.id;
      const name = btn.parentElement.parentElement.className;
      const res = await Api.delete("/api/categories", "", {
        index: index,
        name: name,
      });
      alert(res.msg);
      clickedCategory();
    });
  });
}

// *******************************************************************
// 수정버튼 함수
function modifyCategory() {
  const categoryBody_row_btns_modifys = document.querySelectorAll(
    ".categoryBody_row_btns_modify"
  );

  categoryBody_row_btns_modifys.forEach((btn) => {
    btn.addEventListener("click", async () => {
      // index,name 값 받아옴
      const index = btn.parentElement.parentElement.id;
      const name = btn.parentElement.parentElement.className;

      // 행의 칸 안에 input,button 다시 세팅
      categoryAddBox.innerHTML = `
        <div id="modal-container__inner">
        <p id="modalTitle">카테고리 수정</p>
        <div id="categoryAddBox_name">
          <p>카테고리명</p>
          <input id="categoryAddBox_nameInput" value="${name}" />
        </div>
        <div id="categoryAddBox_index">
          <p>인덱스</p>
          <input id="categoryAddBox_indexInput" value="${index}" />
        </div>
        <div id="categoryAddBox_btns">
          <button id="categoryAddBox_doneBtn" class="button is-dark">수정완료</button>
          <button id="categoryAddBox_cancelBtn" class=" button is-dark">취소</button>
        </div>
        </div>
      `;

      // 수정완료 버튼 이벤트
      const categoryAddBox_doneBtn = document.querySelector(
        "#categoryAddBox_doneBtn"
      );

      categoryAddBox_doneBtn.addEventListener("click", async () => {
        const categoryAddBox_nameInput = document.querySelector(
          "#categoryAddBox_nameInput"
        );
        const categoryAddBox_indexInput = document.querySelector(
          "#categoryAddBox_indexInput"
        );
        // 수정된 값 받아와서 전달
        const modifyName = categoryAddBox_nameInput.value;
        const modifyIndex = categoryAddBox_indexInput.value;

        if (!/^[a-z|A-Z]/.test(modifyIndex)) {
          return alert(`인덱스는 알파벳으로 시작해야합니다.
          ex) a200, b300`);
        }

        const res = await Api.patch("/api/categories", "", {
          name: modifyName,
          index: modifyIndex,
          currentName: name,
        });
        // 수정 완료
        alert("수정되었습니다.");
        categoryAddBox.innerHTML = "";
        clickedCategory();
      });

      // 취소 버튼
      const categoryAddBox_cancelBtn = document.querySelector(
        "#categoryAddBox_cancelBtn"
      );
      categoryAddBox_cancelBtn.addEventListener("click", () => {
        clickedCategory();
      });
    });
  });
}

// *******************************************************************
// 카테고리에만 사용하는 api 함수
// alert으로 에러를 받아야해서 따로 만듬
async function categoryPost(endpoint, data) {
  const apiUrl = "hugging" + endpoint;

  // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
  // 예시: {name: "Kim"} => {"name": "Kim"}

  const bodyData = JSON.stringify(data);
  // console.log(`%cPOST 요청: ${apiUrl}`, "color: #296aba;");
  // console.log(`%cPOST 요청 데이터: ${bodyData}`, "color: #296aba;");

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: bodyData,
  });

  // 응답 코드가 4XX 계열일 때 (400, 403 등)
  if (!res.ok) {
    const errorContent = await res.json();
    const { msg } = errorContent;
    alert(msg);
    throw new Error(msg);
  }

  const result = await res.json();

  return result;
}
