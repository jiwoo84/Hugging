import * as Api from "/api.js";
// 관리자가 아니라면 튕겨내는 기능 구현 예정

// 리스트 들어가는 공간
const listContainer = document.querySelector("#list-container");
// 상품 관리 버튼
const itemBtn = document.querySelector("#items-btn__management");
// 모달창
const modalBox = document.querySelector("#modal-container");
// 카테고리 목록 불러옴
const categories = (await Api.get("/api/categories/all")).data;

// 버튼에 이벤트 넣기
itemBtn.addEventListener("click", clickedItem);

// *******************************************************************
// 상품조회 버튼
async function clickedItem(e) {
  // 모달창 띄워져 있다면 없애기
  modalBox.innerHTML = "";
  // 사이드바 카테고리 하단에 추가 있다면 삭제
  const categoryBtn_add = document.querySelector("#category-btn__add");
  if (categoryBtn_add) {
    categoryBtn_add.parentElement.removeChild(categoryBtn_add);
  }

  // 상품추가 버튼 생성
  if (!document.querySelector("#items-btn__add")) {
    addItemBtn();
  }

  // 표 상단 만들기
  listContainer.innerHTML = `
  <div>
    <table> 
      <thead>
        <tr>
          <th id="itemsCategory">
            <p>카테고리</p>
            <select id="itemsCategorySelecter">
              <option id="all">전체보기</option>
            </select>
          </th>
          <th>이름</th>
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

  // 카테고리 셀렉터 구현
  makeCategorySelecter();

  // 전체 상품 리스트 출력
  makeItemsList("전체보기");
}

// *******************************************************************
// 카테고리 셀렉트 생성, 구현
async function makeCategorySelecter() {
  const itemsCategorySelecter = document.querySelector(
    "#itemsCategorySelecter"
  );

  console.log(categories);
  // option에 카테고리 + 미설정 넣음
  categories.forEach((category) => {
    let option = document.createElement("option");
    option.innerText = category.name;
    itemsCategorySelecter.appendChild(option);
  });

  let noOption = document.createElement("option");
  noOption.innerText = "미설정";
  itemsCategorySelecter.appendChild(noOption);

  // 이벤트리스너 넣음
  itemsCategorySelecter.addEventListener("change", async () => {
    const pickCategoryName = itemsCategorySelecter.value;
    makeItemsList(pickCategoryName);
  });
  // 클릭하면 해당 카테고리 값의 데이터 return
  // makeIemsList에 data 넘겨줌
}

// *******************************************************************
// 상품리스트 출력 함수
async function makeItemsList(categoryName) {
  // 리스트가 들어갈 표의 body
  const itemsBody = document.querySelector("#itemsBody");
  // 상품정보리스트 받아오기
  let data = null;
  // 카테고리에 맞춰 데이터 받아오기
  if (categoryName === "전체보기") {
    data = await Api.get("/api/items/admin");
  } else if (categoryName === "미설정") {
    data = await Api.get("/api/items/affiliation");
  } else {
    let categoryIndex = null;
    // 카테고리 목록에서 해당 카테고리의 인덱스 찾기
    categories.forEach((category) => {
      if (category.name === categoryName) {
        categoryIndex = category.index;
        return;
      }
    });
    console.log("요청카테고리:", categoryName, categoryIndex);
    data =
      await Api.get(`/api/categories?name=${categoryName}&index=${categoryIndex}
`);
  }

  // 상품 리스트 초기화
  itemsBody.innerText = "";
  // 상품 리스트 출력하기
  for (let i = 0; i < data.data.length; i++) {
    const itemData = data.data[i];
    // 한 행 생성
    const itemsBody_row = document.createElement("tr");
    itemsBody_row.id = itemData._id;

    // 행 안에 이름,카테고리,가격,이미지,생성날짜,판매량 추가
    itemsBody_row.innerHTML = `
    <td>${itemData.category}</td>
    <td>${itemData.name}</td>
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
  delItem();
  // 상품 판매시작 버튼
  restartSaleItem();
  // 상품 수정 버튼
  modifyItem();
}

// *******************************************************************
// 상품 수정 버튼
function modifyItem() {
  const itemTableBody_row_modifyBtns = document.querySelectorAll(
    ".itemTableBody_row_modifyBtn"
  );

  // 모달 안에 폼 넣기
  itemTableBody_row_modifyBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.parentElement.id;
      const itemData = (await Api.get(`/api/items/${id}`)).data;
      modalBox.innerHTML = `
      <form id="modal-container__inner" enctype="multipart/form-data">
        <p id="modalTitle">상품 수정</p>
          <p>상품명</p>
          <input id="modalBox_nameInput" value="${itemData.name}"/>
          <p>카테고리</p>
          <select id="modalBox_categorySelect" value="${itemData.category}"></select>
          <p>가격</p>
          <input id="modalBox_priceInput" value="${itemData.price}"/>
          <p>이미지</p>
          <input type="file" id="modalBox_imgInput" name="modalBox_imgInput" accept="image/*" />
          <p>상세설명</p>
          <input id="modalBox_detailInput" value="${itemData.itemDetail}"/>
          <input type="submit" id="modalBox_doneBtn"></input>
          <button id="modalBox_cancelBtn">취소</button>
      </form>
    `;

      // 카테고리값 받아와서 select의 option 값으로 넣기
      const modalBox_categorySelect = document.querySelector(
        "#modalBox_categorySelect"
      );
      const categories = (await Api.get("/api/categories/all")).data;

      categories.forEach((category) => {
        modalBox_categorySelect.innerHTML += `
        <option>${category.name}</option>
      `;
      });

      // 전체 폼 불러오기
      const modalBox_form = document.querySelector("#modal-container__inner");

      // 추가완료 처리: 폼에 submit 이벤트 넣기
      modalBox_form.addEventListener("submit", async (event) => {
        // 새로고침 방지
        event.preventDefault();

        // 폼 내부 input 불러오기
        const modalBox_nameInput = document.querySelector(
          "#modalBox_nameInput"
        );
        const modalBox_categorySelect = document.querySelector(
          "#modalBox_categorySelect"
        );
        const modalBox_priceInput = document.querySelector(
          "#modalBox_priceInput"
        );
        const modalBox_imgInput = document.querySelector("#modalBox_imgInput");
        const modalBox_detailInput = document.querySelector(
          "#modalBox_detailInput"
        );

        // 이미지 파일 데이터 받아오기
        const imgFormData = new FormData(modalBox_form);
        imgFormData.append("img", modalBox_imgInput.file);

        // 입력값 받아오기
        const name = modalBox_nameInput.value;
        const category = modalBox_categorySelect.value;
        const price = modalBox_priceInput.value;
        const detail = modalBox_detailInput.value;

        if (!/[0-9]/.test(price)) {
          return alert("가격에 숫자를 입력해주세요");
        }
        console.log(id);
        // 추가 요청 보내기
        const res = await fetch(
          `/api/items?findItemId=${id}&name=${name}&category=${category}&price=${price}&itemDetail=${detail}&onSale=${undefined}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: imgFormData,
          }
        );

        // const res = await Api.patch(
        //   `
        // /api/items/?findItemId=${id}&
        // name=${name}&
        // category=${category}&
        // price=${price}&
        // itemDetail=${detail}&
        // onSale=${undefined}`,
        //   "",
        //   { zz: "zz" }
        // );

        alert(res.msg);
        modalBox.innerHTML = "";
        makeItemsList("전체보기");
      });

      // 취소 버튼
      const modalBox_cancelBtn = document.querySelector("#modalBox_cancelBtn");
      modalBox_cancelBtn.addEventListener("click", () => {
        modalBox.innerHTML = "";
      });
    });
  });
}

// *******************************************************************
// 상품추가 버튼
function addItemBtn() {
  // 버튼의 부모 불러오기
  const itemsBtnParent = document.querySelector("#items-btn");
  //추가할 버튼 생성
  const itemsBtn_add = document.createElement("div");
  itemsBtn_add.id = "items-btn__add";
  itemsBtn_add.innerText = "상품 추가";
  // 버튼을 부모에 추가
  itemsBtnParent.appendChild(itemsBtn_add);

  itemsBtn_add.addEventListener("click", async () => {
    modalBox.innerHTML = `
      <form id="modal-container__inner" enctype="multipart/form-data">
        <p id="modalTitle">상품 추가</p>
          <p>상품명</p>
          <input id="modalBox_nameInput"/>
          <p>카테고리</p>
          <select id="modalBox_categorySelect"></select>
          <p>가격</p>
          <input id="modalBox_priceInput"/>
          <p>이미지</p>
          <input type="file" id="modalBox_imgInput" name="modalBox_imgInput" accept="image/*" />
          <p>상세설명</p>
          <input id="modalBox_detailInput"/>
          <input type="submit" id="modalBox_doneBtn"></input>
          <button id="modalBox_cancelBtn">취소</button>
      </form>
    `;

    // 카테고리값 받아와서 select의 option 값으로 넣기
    const modalBox_categorySelect = document.querySelector(
      "#modalBox_categorySelect"
    );
    const categories = (await Api.get("/api/categories/all")).data;

    categories.forEach((category) => {
      modalBox_categorySelect.innerHTML += `
        <option>${category.name}</option>
      `;
    });

    // 전체 폼 불러오기
    const modalBox_form = document.querySelector("#modal-container__inner");

    // 추가완료 처리: 폼에 submit 이벤트 넣기
    modalBox_form.addEventListener("submit", async (event) => {
      // 새로고침 방지
      event.preventDefault();

      // 폼 내부 input 불러오기
      const modalBox_nameInput = document.querySelector("#modalBox_nameInput");
      const modalBox_categorySelect = document.querySelector(
        "#modalBox_categorySelect"
      );
      const modalBox_priceInput = document.querySelector(
        "#modalBox_priceInput"
      );
      const modalBox_imgInput = document.querySelector("#modalBox_imgInput");
      const modalBox_detailInput = document.querySelector(
        "#modalBox_detailInput"
      );

      // 이미지 파일 데이터 받아오기
      const imgFormData = new FormData(modalBox_form);
      imgFormData.append("img", modalBox_imgInput.file);

      // 입력값 받아오기
      const name = modalBox_nameInput.value;
      const category = modalBox_categorySelect.value;
      const price = modalBox_priceInput.value;
      const detail = modalBox_detailInput.value;

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
          // body: imgFormData,
        }
      );

      alert("추가 완료했습니다");
      modalBox.innerHTML = "";
      makeItemsList("전체보기");
    });

    // 취소 버튼
    const modalBox_cancelBtn = document.querySelector("#modalBox_cancelBtn");
    modalBox_cancelBtn.addEventListener("click", () => {
      modalBox.innerHTML = "";
    });
  });
}

// *******************************************************************
// 상품 삭제 버튼
function delItem() {
  const itemTableBody_row_delBtns = document.querySelectorAll(
    ".itemTableBody_row_delBtn"
  );
  // 각 버튼에 이벤트리스너 적용
  itemTableBody_row_delBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      console.log("삭제 클릭");
      const id = btn.parentElement.id;
      const res = await Api.delete(`/api/items/${id}`);
      alert(res.msg);
      clickedItem();
    });
  });
}

// *******************************************************************
// 상품 판매시작 버튼
function restartSaleItem() {
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
}
