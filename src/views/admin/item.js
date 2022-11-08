import * as Api from "/api.js";
// 관리자가 아니라면 튕겨내는 기능 구현 예정
// 리스트 들어가는 공간
const listContainer = document.querySelector("#list-container");
// 상품 관리 버튼
const itemBtn = document.querySelector("#items-btn__management");
// 버튼에 이벤트 넣기
itemBtn.addEventListener("click", clickedItem);

// 상품조회 이벤트
async function clickedItem() {
  // 화면 초기화 (모달창)
  const itemAddBox = document.querySelector("#modal-container");
  itemAddBox.innerHTML = "";
  // 사이드바 카테고리 하단에 추가 있다면 삭제
  const categoryBtn_add = document.querySelector("#category-btn__add");
  if (categoryBtn_add) {
    categoryBtn_add.parentElement.removeChild(categoryBtn_add);
  }

  // --------------------------------------------------------------
  // 상품추가
  // 카테고리 하단에 없다면 넣기
  if (!document.querySelector("#items-btn__add")) {
    // 버튼의 부모 불러오기
    const itemsBtnParent = document.querySelector("#items-btn");
    //추가할 버튼 생성
    const itemsBtn_add = document.createElement("div");
    itemsBtn_add.id = "items-btn__add";
    itemsBtn_add.innerText = "상품 추가";
    // 버튼을 부모에 추가
    itemsBtnParent.appendChild(itemsBtn_add);

    itemsBtn_add.addEventListener("click", async () => {
      itemAddBox.innerHTML = `
      <form id="modal-container__inner" enctype="multipart/form-data">
          <p>상품명</p>
          <input id="itemAddbox_nameInput"/>
          <p>카테고리</p>
          <select id="itemAddbox_categorySelect"></select>
          <p>가격</p>
          <input id="itemAddbox_priceInput"/>
          <p>이미지</p>
          <input type="file" id="itemAddbox_imgInput" name="itemAddbox_imgInput" accept="image/*" />
          <p>상세설명</p>
          <input id="itemAddbox_detailInput"/>
          <input type="submit" id="itemAddBox_addBtn"></input>
          <button id="itemAddBox_cancelBtn">취소</button>
      </form>
    `;

      // 카테고리값 받아와서 select의 option 값으로 넣기
      const itemAddbox_categorySelect = document.querySelector(
        "#itemAddbox_categorySelect"
      );
      const categories = (await Api.get("/api/categories/all")).data;

      categories.forEach((category) => {
        itemAddbox_categorySelect.innerHTML += `
        <option>${category.name}</option>
      `;
      });

      // 전체 폼 불러오기
      const itemAddbox_form = document.querySelector("#modal-container__inner");

      // 추가완료 처리: 폼에 submit 이벤트 넣기
      itemAddbox_form.addEventListener("submit", async (event) => {
        // 새로고침 방지
        event.preventDefault();

        // 폼 내부 input 불러오기
        const itemAddbox_nameInput = document.querySelector(
          "#itemAddbox_nameInput"
        );
        const itemAddbox_categorySelect = document.querySelector(
          "#itemAddbox_categorySelect"
        );
        const itemAddbox_priceInput = document.querySelector(
          "#itemAddbox_priceInput"
        );
        const itemAddbox_imgInput = document.querySelector(
          "#itemAddbox_imgInput"
        );
        const itemAddbox_detailInput = document.querySelector(
          "#itemAddbox_detailInput"
        );

        // 이미지 파일 데이터 받아오기
        const imgFormData = new FormData(itemAddbox_form);
        imgFormData.append("img", itemAddbox_imgInput.file);

        // 입력값 받아오기
        const name = itemAddbox_nameInput.value;
        const category = itemAddbox_categorySelect.value;
        const price = itemAddbox_priceInput.value;
        const detail = itemAddbox_detailInput.value;

        if (!/[0-9]/.test(price)) {
          return alert("가격에 숫자를 입력해주세요");
        }

        // 추가 요청 보내기
        const res = await fetch(
          `/api/items?name=${name}&category=${category}&price=${price}&itemDetail=${detail}`,
          {
            method: "post",
            headers: {
              authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: imgFormData,
          }
        );

        alert("추가 완료했습니다");
        itemAddBox.innerHTML = "";
        clickedItem();
      });

      // 취소 버튼
      const itemAddBox_cancelBtn = document.querySelector(
        "#itemAddBox_cancelBtn"
      );
      itemAddBox_cancelBtn.addEventListener("click", () => {
        itemAddBox.innerHTML = "";
      });
    });
  }
  // 표 상단 만들기
  listContainer.innerHTML = `
  <div>
    <table> 
      <thead>
        <tr>
          <th>이름</th>
          <th>카테고리</th>
          <th>가격</th>
          <th>이미지</th>
          <th>생성날짜</th>
          <th>누적판매량</th>
          <th>판매상태</th>
          <th>상세내용</th>
        </tr>
      </thead>
      <tbody id="itemsBody">
      </tbody>
    </table>
  </div>
  `;

  // 상품정보리스트 받아오기
  const data = await Api.get("/api/items/admin");
  // 리스트가 들어갈 표의 body
  const itemsBody = document.querySelector("#itemsBody");

  // 상품 리스트 출력하기
  for (let i = 0; i < data.data.length; i++) {
    const itemData = data.data[i];
    // 한 행 생성
    const itemsBody_row = document.createElement("tr");
    itemsBody_row.id = itemData._id;

    // 행 안에 이름,카테고리,가격,이미지,생성날짜,판매량 추가
    itemsBody_row.innerHTML = `
    <td>${itemData.name}</td>
    <td>${itemData.category}</td>
    <td>${itemData.price}</td>
    <td>
      <img src=${itemData.imageUrl} alt="${itemData.name} 사진" width="70"/>
    </td>
    <td>${itemData.createdAt.slice(0, 10)}</td>
    <td>${itemData.sales}</td>
    `;
    // 조건부 판매상태 출력: 판매량이 있는데 삭제 요청하면, 판매중 / 판매량 없으면 바로 삭제
    if (itemData.onSale) {
      itemsBody_row.innerHTML += "<td>판매중</td>";
    } else {
      itemsBody_row.innerHTML += "<td>판매중지</td>";
    }

    // 상세내용 출력
    itemsBody_row.innerHTML += `
    <td>${itemData.itemDetail}</td>
    `;

    // 조건부 버튼 구현: 게시상태에 따라 달라짐
    if (itemData.onSale) {
      // 펀매중이면 수정,삭제
      itemsBody_row.innerHTML += `
      <td id="${itemData._id}">
        <button class="itemTableBody_row_modifyBtn">상품수정</button>
        <button class="itemTableBody_row_delBtn">상품삭제</button>
      </td>`;
    } else {
      // 판매중단이면 수정,판매시작
      itemsBody_row.innerHTML += `
      <td id="${itemData._id}">
        <button class="itemTableBody_row_modifyBtn">상품수정</button>
        <button class="itemTableBody_row_restartBtn">판매시작</button>
      </td>`;
    }
    itemsBody.appendChild(itemsBody_row);
  }

  // 상품 삭제 버튼
  const itemTableBody_row_delBtns = document.querySelectorAll(
    ".itemTableBody_row_delBtn"
  );
  // 각 버튼에 이벤트리스너 적용
  itemTableBody_row_delBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.parentElement.id;
      const res = await Api.delete(`/api/items/${id}`);
      alert(res.msg);
      clickedItem();
    });
  });

  // 상품 판매시작 버튼
  const itemTableBody_row_restartBtns = document.querySelectorAll(
    ".itemTableBody_row_restartBtn"
  );

  itemTableBody_row_restartBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.parentElement.id;
      await Api.patch(`/api/items/${id}`, "", {
        name: undefined,
        category: undefined,
        price: undefined,
        imageUrl: undefined,
        itemDetail: undefined,
        onSale: true,
      });
      alert("해당 상품이 판매 시작되었습니다.");
      clickedItem();
    });
  });

  // 상품 수정 버튼
  // 리스트 하단에 상세정보칸 나와서 수정가능
  const itemTableBody_row_modifyBtns = document.querySelectorAll(
    ".itemTableBody_row_modifyBtn"
  );
  const itemsModifyBox = document.querySelector("#modal-container");

  itemTableBody_row_modifyBtns.forEach((btn) => {
    btn.addEventListener("click", itemModifyFnc);

    async function itemModifyFnc() {
      // 아래에 페이지 추가로 생성
      const id = btn.parentElement.id;
      // input창 생성
      const itemData = (await Api.get(`/api/items/${id}`)).data;
      itemsModifyBox.innerHTML = `
      <div id="modal-container__inner">
        <h1>상품 수정</h1>
        <table>
          <tr>
            <td>이름</td>
            <td>
              <input id="itemsModifyBox_name" value="${itemData.name}" />
            </td>
          </tr>
          <tr>
            <td>가격</td>
            <td>
              <input id="itemsModifyBox_price" value="${itemData.price}" />
            </td>
          </tr>
          <tr>
            <td>이미지url</td>
            <td>
              <input id="itemsModifyBox_img" value="${itemData.imageUrl}" />
            </td>
          </tr>
          <tr>
            <td>상세내용</td>
            <td>
              <input id="itemsModifyBox_detail" value="${itemData.itemDetail}" />
            </td>
          </tr>
          <tr>
            <td>카테고리</td>
            <td>
              <select id="itemsModifyBox_category" value="${itemData.category}"></select>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <button id="itemsModifyBox_doneBtn">수정 완료</button>
              <button id="itemsModifyBox_cancelBtn">닫기</button>
            </td>
          </tr>
        </table>
        </div>
      `;

      // 카테고리 셀렉트에 값 넣기
      const itemsModifyBox_category = document.querySelector(
        "#itemsModifyBox_category"
      );
      const categories = (await Api.get("/api/categories/all")).data;

      categories.forEach((category) => {
        itemsModifyBox_category.innerHTML += `
        <option>${category.name}</option>
      `;
      });

      // 수정버튼 구현
      const itemsModifyBox_doneBtn = document.querySelector(
        "#itemsModifyBox_doneBtn"
      );

      // input으로 값을 받아서 변경 (아무것도 입력x -> 그대로 저장)
      itemsModifyBox_doneBtn.addEventListener("click", async () => {
        const itemsModifyBox_name = document.querySelector(
          "#itemsModifyBox_name"
        );
        const itemsModifyBox_category = document.querySelector(
          "#itemsModifyBox_category"
        );
        const itemsModifyBox_price = document.querySelector(
          "#itemsModifyBox_price"
        );
        const itemsModifyBox_img = document.querySelector(
          "#itemsModifyBox_img"
        );
        const itemsModifyBox_detail = document.querySelector(
          "#itemsModifyBox_detail"
        );

        await Api.patch(`/api/items/${id}`, "", {
          name: itemsModifyBox_name.value,
          category: itemsModifyBox_category.value,
          price: itemsModifyBox_price.value,
          imageUrl: itemsModifyBox_img.value,
          itemDetail: itemsModifyBox_detail.value,
          onSale: undefined,
        });
        alert("수정이 완료되었습니다");
        itemsModifyBox.innerHTML = "";
        clickedItem();
      });

      // 수정취소 버튼
      const itemsModifyBox_cancelBtn = document.querySelector(
        "#itemsModifyBox_cancelBtn"
      );

      itemsModifyBox_cancelBtn.addEventListener("click", () => {
        itemsModifyBox.innerHTML = "";
      });
    }
  });
}
