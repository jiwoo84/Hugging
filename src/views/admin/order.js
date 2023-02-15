import * as Api from "/api.js";
// 관리자가 아니라면 튕겨내는 기능 구현 예정
// 리스트 들어가는 공간
const listContainer = document.querySelector("#list-container");
// 주문 관리 버튼
const orderBtn = document.querySelector("#order-btn");
// 모달창
const modalBox = document.querySelector("#modal-container");
const page_list = document.querySelector("#page_list");

orderBtn.addEventListener("click", clickedOrder);

// *******************************************************************
// 주문 조회 클릭
async function clickedOrder() {
  // 화면 초기화
  listContainer.innerHTML = "";
  modalBox.innerHTML = "";

  // 상품관리, 카테고리관리 하단에 버튼 있다면 지우기
  const categoryBtn_add = document.querySelector("#category-btn__add");
  const itemsBtn_add = document.querySelector("#items-btn__add");
  if (categoryBtn_add.innerText !== "") {
    categoryBtn_add.innerText = "";
  }
  if (itemsBtn_add.innerText !== "") {
    itemsBtn_add.innerText = "";
  }

  if (page_list.innerHTML === "") {
    pagenation();
  }

  makeOrderList("1");

  // 비동기인 pagenation 이후에 처리 위해서 이렇게함
  setTimeout(() => {
    makePageBold(1);
  }, 150);
}

// *******************************************************************
// 페이지네이션 함수
async function pagenation() {
  try {
    const totalPage = await Api.get("/api/orders");
    page_list.className = "";
    for (let i = 1; i <= totalPage.totalPage; i++) {
      const page = document.createElement("div");
      page.textContent = i;
      page.addEventListener("click", () => {
        listContainer.innerHTML = ``;
        makePageBold(i);
        makeOrderList(`${i}`);
      });
      page_list.appendChild(page);
    }
  } catch (err) {
    alert(err);
  }
}

// 클릭한 페이지 표시하는 함수
function makePageBold(num) {
  let pages = Array.from(page_list.children);
  pages.forEach((page) => {
    if (+page.innerText === num) {
      page.className = "page_list_currentClick";
    } else {
      page.className = "";
    }
  });
}

// *******************************************************************
// 리스트 출력 함수
async function makeOrderList(page) {
  // 주문 리스트 데이터 받아오기
  let data;
  try {
    data = (await Api.get(`/api/orders?page=${page}`)).data;
  } catch (err) {
    window.location.reload();
  }
  // console.log(data);
  //한 사람의 주문정보 넣기
  for (let i = 0; i < data.length; i++) {
    const orderBox = document.createElement("div");
    orderBox.className = "orderBox box";

    // ------------------------------------------------
    // orderBox = orderBox_order + orderBox_user + orderBox_btn
    //상품배송정보
    const orderBox_order = document.createElement("div");
    orderBox_order.className = "orderBox_order";

    //주문날짜, 주문시간, 주문번호
    const orderBox_order_date = document.createElement("div");
    const DATE = data[i].주문날짜;

    //날짜랑 시간 분리해서 출력
    orderBox_order_date.innerHTML = `
        <p><b>주문 일자:</b> ${DATE.slice(0, 10)}</p>
        <p><b>주문 시간:</b> ${DATE.slice(11, 19)}</p>
        <p><b>주문 번호:</b> ${data[i].주문번호}</p>
    `;

    // 주문상품,개수
    const orderBox_order_items = document.createElement("div");
    for (let j = 0; j < data[i].상품목록.length; j++) {
      const item = document.createElement("p");
      item.innerText = `${data[i].상품목록[j].상품} ${data[i].상품목록[j].개수}개`;
      orderBox_order_items.appendChild(item);
    }

    // 배송상태
    const orderBox_order_shippingState = document.createElement("p");
    orderBox_order_shippingState.innerHTML = `<b>${data[i].배송상태}</b>`;

    // 요청메세지(배송메시지)
    const orderBox_order_shippingMsg = document.createElement("p");
    orderBox_order_shippingMsg.innerText = data[i].요청사항;

    orderBox_order.appendChild(orderBox_order_date);
    orderBox_order.appendChild(orderBox_order_items);
    orderBox_order.appendChild(orderBox_order_shippingState);
    orderBox_order.appendChild(orderBox_order_shippingMsg);

    // -------------------------------------------------------
    // 주문자 정보
    const orderBox_user = document.createElement("div");
    orderBox_user.className = "orderBox_user";

    // 탈퇴한 유저 처리
    if (data[i].구매자이름 === "탈퇴한유저") {
      orderBox_user.innerHTML = `
        <p>${data[i].구매자이름}</p>
      `;
    } else {
      orderBox_user.innerHTML = `
        <p>${data[i].구매자이름}</p>
        <p>${data[i].구매자이메일}</p>
        <p>${data[i].전화번호}</p>
        <p>${data[i].주소}</p>
      `;
    }

    // --------------------------------------------------------
    // 주문삭제,발송완료 버튼
    const orderBox_btn = document.createElement("div");
    orderBox_btn.className = "orderBox_btn";
    orderBox_btn.id = data[i].주문번호;

    if (data[i].수정 === "수정가능") {
      orderBox_btn.innerHTML = `
      <label>배송상태변경</label>
      <select class="orderBox_btn_select">
      <option>배송준비중</option>
      <option>배송중</option>
      <option>배송완료</option>
      </select> 
      <button class="orderBox_btn_delBtn button is-dark">주문삭제</button>
        `;
    } else {
      orderBox_btn.innerHTML = "";
    }

    // ------------------------------------------------------
    // listContainer에 모든 box 삽입
    orderBox.appendChild(orderBox_order);
    orderBox.appendChild(orderBox_user);
    orderBox.appendChild(orderBox_btn);
    listContainer.appendChild(orderBox);
  }

  // 주문 삭제 버튼 이벤트 추가
  delOrder();

  // 배송 상태 변경 이벤트 추가
  changeShippingState();
}

// *******************************************************************
// 주문 삭제 구현 함수
function delOrder() {
  // 주문삭제 버튼
  const orderBox_btn_delBtns = document.querySelectorAll(
    ".orderBox_btn_delBtn"
  );

  orderBox_btn_delBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.parentElement.id;
      const res = await Api.patch(`/api/orders`, "", {
        id: id,
        reson: "orderCancel",
      });
      alert("삭제되었습니다!");
      clickedOrder();
    });
  });
}

// *******************************************************************
// 배송상태 변경 구현 함수
function changeShippingState() {
  // 배송상태 변경
  const orderBox_btn_selects = document.querySelectorAll(
    ".orderBox_btn_select"
  );
  orderBox_btn_selects.forEach((select) => {
    select.addEventListener("change", async () => {
      const id = select.parentElement.id;
      // 선택된 배송상태
      const changedState = select.value;
      await Api.patch("/api/orders", "", {
        id: id,
        reson: changedState,
      });
      alert("배송상태가 변경되었습니다");
      clickedOrder();
    });
  });
}
