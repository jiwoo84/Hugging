import * as Api from "/api.js";
// 관리자가 아니라면 튕겨내는 기능 구현 예정
// 리스트 들어가는 공간
const listContainer = document.querySelector("#list-container");
// 주문 관리 버튼
const orderBtn = document.querySelector("#order-btn");

// 버튼에 이벤트 넣기
orderBtn.addEventListener("click", clickedOrder);

// 주문 조회 버튼
async function clickedOrder() {
  // 화면 초기화
  const modalBox = document.querySelector("#modal-container");
  listContainer.innerHTML = "";
  modalBox.innerHTML = "";

  // 상품관리, 카테고리관리 하단에 버튼 있다면 지우기
  const categoryBtn_add = document.querySelector("#category-btn__add");
  const itemsBtn_add = document.querySelector("#items-btn__add");
  if (categoryBtn_add) {
    categoryBtn_add.parentElement.removeChild(categoryBtn_add);
  }
  if (itemsBtn_add) {
    itemsBtn_add.parentElement.removeChild(itemsBtn_add);
  }

  // 주문 리스트 데이터 받아오기
  const data = (await Api.get("/api/orders")).data;

  //한 사람의 주문정보 넣기
  for (let i = 0; i < data.length; i++) {
    const orderBox = document.createElement("div");
    orderBox.className = "orderBox";

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
        <p>주문 일자: ${DATE.slice(0, 10)}</p>
        <p>주문 시간: ${DATE.slice(11, 19)}</p>
        <p>주문 번호: ${data[i].주문번호}</p>
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
    orderBox_order_shippingState.innerText = data[i].배송상태;

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

    orderBox_user.innerHTML = `
    <p>${data[i].구매자이름}</p>
    <p>${data[i].구매자이메일}</p>
    <p>${data[i].전화번호}</p>
    <p>${data[i].주소}</p>
    `;

    // --------------------------------------------------------
    // 주문삭제,발송완료 버튼
    const orderBox_btn = document.createElement("div");
    orderBox_btn.className = "orderBox_btn";
    orderBox_btn.id = data[i].주문번호;

    if (data[i].수정 === "수정가능") {
      orderBox_btn.innerHTML = `
      <button class="orderBox_btn_delBtn">주문삭제</button>
      <label>배송상태변경</label>
      <select class="orderBox_btn_select">
      <option>배송준비중</option>
      <option>배송중</option>
      <option>배송완료</option>
        </select> 
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

  // 주문삭제 버튼에 이벤트 추가
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

  // 배송상태 변경 (select) 이벤트동작 추가
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
