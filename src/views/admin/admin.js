import * as Api from "/api.js";

const addItemBox = document.querySelector("#list-box");
const orderBtn = document.querySelector("#orderBtn");
const itemBtn = document.querySelector("#itemBtn");
const categoryBtn = document.querySelector("#categoryBtn");

orderBtn.addEventListener("click", clickedOrder);
itemBtn.addEventListener("click", clickedItem);
categoryBtn.addEventListener("click", clickedCategory);

async function clickedOrder() {
  alert("주문목록 추가/수정/삭제");
  const data = await Api.get("/api/orders/");
  console.log(data);
  addItemBox.innerHTML = "";

  // bigDiv: 한 사람의 주문정보 넣기 (first + second + thrid)
  for (let i = 0; i < data.data.length; i++) {
    const bigDiv = document.createElement("div");
    console.log("첫번째 for문");

    // firstDiv: 상품배송정보
    const firstDiv = document.createElement("div");

    // firstDiv-orderInfoDiv:주문날짜, 주문시간, 주문번호
    const orderInfoDiv = document.createElement("div");
    orderInfoDiv.id = data.data[i].주문번호;

    orderInfoDiv.innerHTML = `
        <p>${data.data[i].주문날짜}</p>
        <p>${data.data[i].주문시간}</p>
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

    // thirdDiv: 주문삭제,발송완료 버튼
    const thirdDiv = document.createElement("div");
    thirdDiv.innerHTML = `
    <button id="${data.data[i]._id}" class="delBtn">주문삭제</button>
    <label for="changeShippingState">배송상태변경</label>
    <select id="changeShippingState">
        <option>배송준비중</option>
        <option>배송중</option>
        <option>배송완료</option>
    </select>
    `;

    bigDiv.appendChild(firstDiv);
    bigDiv.appendChild(secondDiv);
    bigDiv.appendChild(thirdDiv);
    addItemBox.appendChild(bigDiv);
  }

  console.log("정렬완료");
}

// 주문삭제 함수
const delBtn = document.querySelector(".delBtn");
delBtn.addEventListener("click", async (e) => {
  console.log(e.target);
  await Api.patch(`/api/items?id=${id}`);
  alert("삭제되었습니다!");
});

// 배송상태변경 함수
const changeSelect = document.querySelector("#changeShippingState");

async function clickedItem() {
  alert("아이템 추가/수정/삭제");
  $.ajax({
    type: "GET",
    url: "/api/items/admin",
    headers: { authorization: `Bearer ${sessionStorage.getItem("token")}` },
    success: (res) => {
      const addItem = document.getElementById("addItem");
      addItem.innerHTML = "";
      console.log(res.data);
      for (let i = 0; i < res.data.length; i++) {
        console.log("포문");
        const div = document.createElement("div");
        div.id = res.data[i]._id;
        div.innerHTML = `
            <p>상품이름 : ${res.data[i].name}</p>
            <p>카테고리 : ${res.data[i].category}</p>
            <img src="${res.data[i].imageUrl}"/>
            <p>가격 : ${res.data[i].price}원</p>
            `;
        addItem.appendChild(div);
      }
    },
  });
}
