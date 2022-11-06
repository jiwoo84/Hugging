import * as Api from "/api.js";
// 관리자가 아니라면 튕겨내는 기능 구현 예정

// 화면이 들어가는 공간
const listContainer = document.querySelector("#list-container");
// 카테고리 관리 버튼
const categoryBtn = document.querySelector("#category-btn");
// 버튼에 이벤트 넣기
categoryBtn.addEventListener("click", clickedCategory);

// 카테고리 관리 버튼
async function clickedCategory() {
  // 리스트에 카테고리 출력
  listContainer.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>카테고리명</th>
          <th>인덱스</th>
        </tr>
      </thead>
      <tbody id="categoryBody">
      </tbody>
    </table>
  `;
  const datas = (await Api.get("/api/categories/all")).data;
  const categoryBody = document.querySelector("#categoryBody");

  //
  datas.forEach((data) => {
    categoryBody.innerHTML += `
      <tr id=${data.index} class=${data.name}>
        <td class="categoryBody_row_nameContent">${data.name}</td>
        <td class="categoryBody_row_indexContent">${data.index}</td>
        <td class="categoryBody_row_btns">
          <button class="categoryBody_row_btns_modify">수정</button>
          <button class="categoryBody_row_btns_del">삭제</button>
        </td>
      </tr>
    `;
  });
  // 리스트, 수정, 삭제 버튼 삽입
  // 삭제버튼 구현
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

  // 수정버튼 구현
  const categoryBody_row_btns_modifys = document.querySelectorAll(
    ".categoryBody_row_btns_modify"
  );

  categoryBody_row_btns_modifys.forEach((btn) => {
    btn.addEventListener("click", async () => {
      // index,name 값 받아옴
      const index = btn.parentElement.parentElement.id;
      const name = btn.parentElement.parentElement.className;
      // ** index 형태를 바꿔서 index로 식별하게 변경해야함
      const categoryBody_row = document.querySelector(`.${name}`);

      // 행의 칸 안에 input,button 다시 세팅
      categoryBody_row.innerHTML = `
        <td class="categoryBody_row_nameContent">
          <input id="categoryBody_row_nameContent_input" value="${name}" />
        </td>
        <td class="categoryBody_row_indexContent">
          <input id="categoryBody_row_indexContent_input" value="${index}" />
        </td>
        <td class="categoryBody_row_btns">
          <button class="categoryBody_row_btns_modifyDone">수정완료</button>
          <button class="categoryBody_row_btns_cancel">취소</button>
        </td>
      `;

      // 수정완료 버튼 이벤트
      const categoryBody_row_btns_modifyDone = document.querySelector(
        ".categoryBody_row_btns_modifyDone"
      );

      categoryBody_row_btns_modifyDone.addEventListener("click", async () => {
        const categoryBody_row_nameContent_input = document.querySelector(
          "#categoryBody_row_nameContent_input"
        );
        const categoryBody_row_indexContent_input = document.querySelector(
          "#categoryBody_row_indexContent_input"
        );
        // 수정된 값 받아와서 전달
        const modifyName = categoryBody_row_nameContent_input.value;
        const modifyIndex = categoryBody_row_indexContent_input.value;

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
        alert(res.msg);
        clickedCategory();
      });

      // 취소 버튼
      const categoryBody_row_btns_cancel = document.querySelector(
        ".categoryBody_row_btns_cancel"
      );
      categoryBody_row_btns_cancel.addEventListener("click", () => {
        console.log("취소누름");
        clickedCategory();
      });
    });
  });

  // 카테고리 추가
  const categoryAddBox = document.querySelector("#modal-container");
  const categoryBtn_add = document.querySelector("#category-btn__add");

  // 카테고리 추가 버튼 이벤트 -> 모달창 생성
  categoryBtn_add.addEventListener("click", async () => {
    console.log("클릭함");
    categoryAddBox.innerHTML = `
      <div id="modal-container__inner">
          <p>카테고리명</p>
          <input id="categoryAddBox_nameInput"/>
          <p>인덱스</p>
          <input id="categoryAddBox_indexInput"/>
          <button id="categoryAddBox_addBtn">추가완료</button>
          <button id="categoryAddBox_cancelBtn">취소</button>
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
      const modifyName = categoryAddBox_nameInput.value;
      const modifyIndex = categoryAddBox_indexInput.value;
      // 빈칸인지 검사
      if (modifyName === "" || modifyIndex === "") {
        return alert("값을 입력해주세요");
      }
      // 인덱스 형태 검사
      if (!/^[a-z|A-Z]/.test(modifyIndex)) {
        return alert(`인덱스는 알파벳으로 시작해야합니다. ex) a200, b300`);
      }
      // 검사를 통과했으면 요청 보냄
      const res = await Api.post("/api/categories", {
        name: modifyName,
        index: modifyIndex,
      });
      alert(res.msg);
      // 모달창 없애기
      categoryAddBox.innerHTML = "";
      clickedCategory();
    });

    const categoryAddBox_cancelBtn = document.querySelector(
      "#categoryAddBox_cancelBtn"
    );

    categoryAddBox_cancelBtn.addEventListener("click", () => {
      categoryAddBox.innerHTML = "";
    });
  });
}
