import * as Api from "/api.js";

const bigDiv = document.querySelector("#list-box");
const orderBtn = document.querySelector("#orderBtn");
const itemBtn = document.querySelector("#itemsBtn");
const categoryBtn = document.querySelector("#categoryBtn");
orderBtn.addEventListener("click", clickedOrder);
itemBtn.addEventListener("click", clickedItem);
categoryBtn.addEventListener("click", clickedCategory);

async function clickedOrder() {
  const data = await Api.get("/api/orders/");
  bigDiv.innerHTML = "";

  // divComponent: 한 사람의 주문정보 넣기 (first + second + thrid)
  for (let i = 0; i < data.data.length; i++) {
    console.log(data.data[i]);
    //
    const divComponent = document.createElement("div");
    divComponent.className = "divComponent";
    console.log("첫번째 for문");

    // firstDiv: 상품배송정보
    const firstDiv = document.createElement("div");
    firstDiv.className = "firstDiv";

    // firstDiv-orderInfoDiv:주문날짜, 주문시간, 주문번호
    const orderInfoDiv = document.createElement("div");

    orderInfoDiv.id = data.data[i].주문번호;
    const orderDate = data.data[i].주문날짜;

    // orderDate=Date.now() => 날짜랑 시간 분리해서 출력
    orderInfoDiv.innerHTML = `
        <p>${orderDate.slice(0, 10)}</p>
        <p>${orderDate.slice(11, 19)}</p>
        <p>${data.data[i].주문번호}</p>
    `;

    // firstDiv-itemsDiv: 주문상품,개수
    const itemsDiv = document.createElement("div");
    const ul = document.createElement("ul");
    for (let j = 0; j < data.data[i].상품목록.length; j++) {
      console.log("두번째 for문");
      const li = document.createElement("li");
      li.innerText = `${data.data[i].상품목록[j].상품} ${data.data[i].상품목록[j].개수}개`;
      ul.appendChild(li);
    }

    // firstDiv-itemsDiv li 마지막에 배송상태 추가
    const shippingState = document.createElement("li");
    shippingState.innerText = data.data[i].배송상태;
    shippingState.id = "shippingState";
    ul.appendChild(shippingState);
    itemsDiv.appendChild(ul);

    firstDiv.appendChild(orderInfoDiv);
    firstDiv.appendChild(itemsDiv);

    // secondDiv:주문자 정보 추가
    const secondDiv = document.createElement("div");

    secondDiv.innerHTML = `
    <p>${data.data[i].구매자이름}</p>
    <p>${data.data[i].구매자이메일}</p>
    <p>${data.data[i].전화번호}</p>
    <p>${data.data[i].주소}</p>
    `;

    divComponent.appendChild(firstDiv);
    divComponent.appendChild(secondDiv);

    // thirdDiv: 주문삭제,발송완료 버튼 (구매취소,판매자취소시 수정불가)
    const thirdDiv = document.createElement("div");
    thirdDiv.className = "thirdDiv";

    if (data.data[i].수정 === "수정가능") {
      thirdDiv.innerHTML = `
        <button id="${data.data[i].주문번호} class="delBtn">주문삭제</button>
        <label for="${data.data[i].주문번호}">배송상태변경</label>
        <select id="${data.data[i].주문번호}" class="selectShippingState">
            <option>배송준비중</option>
            <option>배송중</option>
            <option>배송완료</option>
        </select> 
        `;
    } else {
      thirdDiv.innerHTML = "";
    }
    divComponent.appendChild(thirdDiv);

    bigDiv.appendChild(divComponent);
  }

  console.log("정렬완료");

  // 주문삭제 버튼
  const delBtns = document.querySelectorAll(".delBtn");

  // 버튼마다 이벤트동작 추가
  delBtns.forEach((delBtn) => {
    delBtn.addEventListener("click", async () => {
      const id = delBtn.id;
      await Api.patch(`/api/orders`, "", {
        id: id,
        reson: "orderCancel",
      });
      alert("삭제되었습니다!");
      clickedOrder();
    });
  });

  // 배송상태 변경 (select) 이벤트동작 추가
  const selects = document.querySelectorAll(".selectShippingState");

  selects.forEach((select) => {
    select.addEventListener("change", async () => {
      const id = select.id;
      // 선택된 배송상태
      const changedState = select.value;
      console.log(changedState);
      await Api.patch("/api/orders", "", {
        id: id,
        reson: changedState,
      });
      alert("배송상태가 변경되었습니다");
      clickedOrder();
    });
  });
}

async function clickedItem() {
  // 화면 초기화
  bigDiv.innerHTML = `
  <div id="productsListBox">
    <table>
      <thead>
        <tr>
          <th>이름</th>
          <th>카테고리</th>
          <th>가격</th>
          <th>이미지</th>
          <th>생성날짜</th>
          <th>현재판매량</th>
          <th>상세내용</th>
        </tr>
      </thead>
      <tbody id="tableBody">
      </tbody>
    </table>
  </div>
  <div id="productDetailBox"></div>
  `;

  const data = await Api.get("/api/items/admin");
  // 리스트가 들어갈 표의 body
  const tableBody = document.querySelector("#tableBody");

  for (let i = 0; i < data.data.length; i++) {
    const productObj = data.data[i];
    console.log(productObj);
    // 한 행 생성
    const tr = document.createElement("tr");
    tr.id = productObj._id;
    // 행 안에 값 넣기
    tr.innerHTML = `
    <td>${productObj.name}</td>
    <td>${productObj.category}</td>
    <td>${productObj.price}</td>
    <td>
      <img src=${productObj.imageUrl} id="listImg"/>
    </td>
    <td>${productObj.createdAt.slice(0, 10)}</td>
    <td>${productObj.sales}</td>
    <td>${productObj.itemDetail}</td>
    <td>
      <button id=${productObj._id} class="productModifyBtn">상품수정</button>
      <button id=${productObj._id} class="productDelBtn">상품삭제</button>
    </td>
    `;
    tableBody.appendChild(tr);
  }

  // 상품 삭제
  const productDelBtns = document.querySelectorAll(".productDelBtn");

  productDelBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.id;
      const res = await Api.delete(`api/items/${id}`);
      console.log(res.msg);
      clickedItem();
    });
  });

  // 상품 수정
  const productModifyBtn = document.querySelectorAll(".productModifyBtn");
  const productDetailBox = document.querySelector("#productDetailBox");

  productModifyBtn.forEach((btn) => {
    btn.addEventListener("click", async () => {
      // 아래에 페이지 추가로 생성
      const id = btn.id;
      const productInfo = await Api.get(`api/items`, id);
      console.log(productInfo);
      // productDetailBox.innerHTML = `
      //   <p></p>
      // `
      // 거기에 레이아웃 만들어서 데이터 + 수정버튼 뿌림
      // 수정 버튼 누르면 input 만들어지게 함
    });
  });
}
