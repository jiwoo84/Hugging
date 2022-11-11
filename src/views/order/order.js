import * as Api from "/api.js";
import { addCommas } from "/useful-functions.js";
import { convertToNumber } from "/useful-functions.js";

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
    //mypage api get요청
    const user = await Api.get("/api/users/mypage");
    if (!user) {
        window.location.reload();
    }
    //coupon api get요청
    const coupon = await Api.get("/api/coupons",`${user.data._id}`);
    const coupons = coupon.couponList;
    
    const {name,address,phoneNumber} = user.data;
    //사용자정보 rendering
    renderUserComponent(name,address,phoneNumber);
    //indexed DB에서 상품 데이터에 접근, rendering 호출
    renderProductComponent(localStorage.getItem("storeName"));
    //쿠폰 rendering 
    renderCouponComponent(coupons);
}

//쿠폰 rendering 
function renderCouponComponent(coupons){
    coupons.forEach( coupon => {
        const option = document.createElement("option");
        option.setAttribute("value",coupon.discount);
        option.setAttribute("id",coupon._id);
        option.innerText = `${coupon.name}  ${coupon.discount}% 할인  ${coupon.createdAt}까지`
        couponSelect.appendChild(option);
    });
}

// 장바구니에서 선택한 상품들의 총 결제금액
function getTotalPrice(key, storeName) {
  //1 장바구니에서 결제창으로 이동한 경우
  if (storeName === "items") {
    totalPrice = localStorage.getItem("TotalPrice");
    orderPrice.innerText = `${addCommas(totalPrice)}원`;
    return;
  }
  //2 바로구매로 결제창으로 이동한 경우( 한 종류의 상품 )
  const container = document.getElementById(`${key}`);
  const productPrice = container.querySelector(".itemsPrice");
  totalPrice = convertToNumber(productPrice.innerText);
  orderPrice.innerText = `${addCommas(totalPrice)}원`;
}

//사용자정보 rendering
function renderUserComponent(name, address, phoneNumber) {
  const nameInfo = document.createElement("p");
  const addressInfo = document.createElement("div");
  nameInfo.setAttribute("class", "nameInfo");
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

// renderging
function createCard(item, key) {
  const priceSum = item.price * item.sales;
  return `
    <div id="${key}" class = "card">
        <img src="${item.img}" class="cardImg">
        <div class="productInfo">
            <p class ="name">${item.name}</p>
            <p class ="category">${item.category}</p>
            <br>
            <p class="price">${addCommas(item.price)}원</p>
            <p class="quantity">${item.sales}개</p>
            <br>
            <p class="itemsPrice">${addCommas(priceSum)}원</p>
        </div>
    </div>
    `;
}

//indexed DB에서 상품 데이터에 접근, 렌더링함수 호출
function renderProductComponent(storeName) {
  if (window.indexedDB) {
    // DB 열기
    const request = indexedDB.open("cart");

    request.onerror = (e) => console.log(e.target.errorCode);
    request.onsuccess = (e) => {
      // items 저장소 접근
      // 선택했던 상품들의 id를 split
      const keys = localStorage.getItem("keys").split(",");
  
      const db = request.result;
      const objStore = db
        .transaction(`${storeName}`, "readwrite")
        .objectStore(`${storeName}`);
      
      keys.forEach((key) => {
        const value = objStore.get(key);
        value.onsuccess = (e) => {
          
          productContainer.insertAdjacentHTML(
            "beforeend",
            createCard(value.result, key)
          );
          const { id } = value.result;
          const count = value.result.sales;
          // 주문할 상품의 id와 count(주문개수)를 items배열에 저장
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

// 구매 버튼 클릭시 addEventListener
// 서버로 보낼 데이터 보내기
purchaseBtn.addEventListener("click", async()=>{

  if (window.confirm("구매하시겠습니까?")) {
    const storeName =  localStorage.getItem("storeName");
    const user = await Api.get("/api/users/mypage");
    const couponId = couponSelect.options[couponSelect.selectedIndex].id;

    const {name,address,phoneNumber} = user.data;
    const deliveryMsg = (deliveryMessage.options[deliveryMessage.selectedIndex].innerText);

    const card = document.querySelector('input[name="radio"]').checked;
    let payMethod;
    if(card){
        payMethod = "카드결제";
    }else{
        payMethod = "무통장입금";
    }

    totalPrice = convertToNumber(orderPrice.innerText);

    // 서버로 보낼 postData
    const postData = {name,address,phoneNumber,deliveryMsg,items,payMethod,totalPrice,couponId}
    // post요청
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

    // 홈으로 이동
    window.location.href = "/";
  }
});

// 쿠폰을 선택하게 되는 경우 addEventListener
couponSelect.addEventListener("change", () => {
  // 선택한 옵션의 value
  const discount = couponSelect.options[couponSelect.selectedIndex].value;
  // 전체금액에서 할인을 적용한 금액
  const couponedPrice =  Math.ceil(totalPrice * (100 - Number(discount)) * 0.01);

  orderPrice.innerText = `${couponedPrice.toLocaleString('ko-KR')}원`;
});
