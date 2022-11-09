import * as Api from "/api.js";

const orderedMan = document.querySelector(".orderedMan");
const orderedAdress = document.querySelector(".orderedAdress");
const moveToCartBtn = document.querySelector(".moveToCart");
const productContainer = document.querySelector(".productContainer");
const orderPrice = document.querySelector(".totalPrice");
const purchaseBtn = document.querySelector(".purchase");
const deliveryMessage = document.querySelector(".deliveryMsg");
const couponSelect = document.querySelector(".couponSelect");

let items = [];
let totalPrice = 0;
getDataFromApi();

async function getDataFromApi() {
  const user = await Api.get("/api/users/mypage");
  if (!user) {
    window.location.reload();
  }
  console.log(user);
  const coupons = await Api.get("/api/coupons", `${user.data._id}`);
  const { couponId, createAt, discount, owner } = coupons;
  const couponName = coupons.name;

  const { name, address, phoneNumber } = user.data;
  renderUserComponent(name, address, phoneNumber);
  renderProductComponent(localStorage.getItem("storeName"));
  renderCouponComponent(couponName, discount, createAt);
}

function renderCouponComponent(couponName, discount, createAt) {
  const option = document.createElement("option");
  option.setAttribute("value", discount);
  option.innerText = `${couponName}  ${discount}% 할인  ${createAt}까지`;
  couponSelect.appendChild(option);
}

function getTotalPrice(key, storeName) {
  if (storeName === "items") {
    //장바구니에서 결제창
    totalPrice = localStorage.getItem("TotalPrice");
    orderPrice.innerText = `${totalPrice}원`;
    return;
  }
  //바로구매로 결제창( 한 종류의 상품 )
  const container = document.getElementById(`${key}`);
  const productPrice = container.querySelector(".itemsPrice");
  totalPrice = parseInt(productPrice.innerText.split(":")[1]);
  orderPrice.innerText = `${totalPrice}원`;
}

function renderUserComponent(name, address, phoneNumber) {
  const nameInfo = document.createElement("p");
  nameInfo.setAttribute("class", "nameInfo");
  const addressInfo = document.createElement("div");
  addressInfo.setAttribute("class", "addressInfo");
  nameInfo.innerText = `${name}`;
  addressInfo.innerHTML = `
        <p>${name}</p>
        <p>${address}</p>
        <p>${phoneNumber}</p>
    `;

  orderedMan.appendChild(nameInfo);
  orderedAdress.appendChild(addressInfo);
}

function createPost(item, key) {
  const priceSum = item.price * item.sales;
  return `
    <div id="${key}" class = "card">
        <img src="${item.img}" class="cardImg">
        <div class="productInfo">
            <p class ="name">${item.name}</p>
            <p class ="category">${item.category}</p>
            <br>
            <p class="price">${item.price}원</p>
            <p class="quantity">${item.sales}개</p>
            <br>
            <p class="itemsPrice">금액합계 : ${priceSum}</p>
        </div>
    </div>
    `;
}

function renderProductComponent(storeName) {
  if (window.indexedDB) {
    // 1. DB 열기
    const request = indexedDB.open("cart");

    request.onerror = (e) => console.log(e.target.errorCode);
    request.onsuccess = (e) => {
      // 2. items 저장소 접근
      const keys = localStorage.getItem("keys").split(",");
      console.log(keys);
      const db = request.result;
      const objStore = db
        .transaction(`${storeName}`, "readwrite")
        .objectStore(`${storeName}`);

      keys.forEach((key) => {
        const value = objStore.get(key);
        value.onsuccess = (e) => {
          //6. 상품추가 렌더링 실행
          productContainer.insertAdjacentHTML(
            "beforeend",
            createPost(value.result, key)
          );
          const { id } = value.result;
          const count = value.result.sales;
          items.push({ id, count });
          getTotalPrice(value.result.id, storeName);
        };
      });
    };
  }
}

moveToCartBtn.addEventListener("click", () => {
  // 바로구매에서 결제페이지로 넘어온 경우
  // 결제페이지를 벗어나게 되면 nowBuy 테이블 레코드 삭제
  const storeName = localStorage.getItem("storeName");
  if (storeName === "nowBuy") {
    const request = window.indexedDB.open("cart");
    request.onerror = (e) => console.log(e.target.errorCode);
    request.onsuccess = (e) => {
      const db = request.result;
      const objStore = db
        .transaction(`${storeName}`, "readwrite")
        .objectStore(`${storeName}`);
      const objStoreRequest = objStore.clear();
      objStoreRequest.onsuccess = (e) => {
        console.log("cleared");
      };
    };
    window.location.href = "/cart";
    return;
  }
  // 장바구니로 돌아가기
  window.location.href = "/cart";
});

purchaseBtn.addEventListener("click", async () => {
  //indexeddb에서 -> 상품데이터 가져오고 배열형태로
  //총금액
  const storeName = localStorage.getItem("storeName");
  const user = await Api.get("/api/users", "mypage");
  const { name, address, phoneNumber } = user.data;
  const deliveryMsg =
    deliveryMessage.options[deliveryMessage.selectedIndex].innerText;
  const card = document.querySelector('input[name="radio"]').checked;
  let payMethod;
  if (card) {
    payMethod = "카드결제";
  } else {
    payMethod = "무통장입금";
  }

  const postData = {
    name,
    address,
    phoneNumber,
    deliveryMsg,
    items,
    payMethod,
    totalPrice,
  };
  console.log(postData);
  await Api.post("/api/orders/", postData);

  //주문완료후 indexedDB 비우기
  const request = window.indexedDB.open("cart");
  request.onerror = (e) => console.log(e.target.errorCode);
  request.onsuccess = (e) => {
    const db = request.result;
    const objStore = db
      .transaction(`${storeName}`, "readwrite")
      .objectStore(`${storeName}`);
    const objStoreRequest = objStore.clear();
    objStoreRequest.onsuccess = (e) => {
      console.log("cleared");
    };
  };
  alert("주문이 완료되었습니다.");

  window.location.href = "/";
});

couponSelect.addEventListener("change", () => {
  let discount = couponSelect.options[couponSelect.selectedIndex].value;
  console.log(discount);
  totalPrice = totalPrice * (100 - Number(discount)) * 0.01;
  orderPrice.innerText = `${totalPrice}원`;
});
