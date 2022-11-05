import * as Api from "/api.js";

const orderedMan= document.querySelector(".orderedMan");
const orderedAdress= document.querySelector(".orderedAdress");
const moveToCartBtn = document.querySelector(".moveToCart");
const productContainer = document.querySelector(".productContainer");
const totalPriceContainer=document.querySelector(".totalPriceContainer");
const totalPrice=document.querySelector(".totalPrice");
const purchaseBtn=document.querySelector(".purchase");
const deliveryMsg = document.querySelector(".deliveryMsg");


getDataFromApi();

async function getDataFromApi() {
    const user = await Api.get("/api/users","mypage");
    const {name,address,phoneNumber} = user.data;
    renderUserComponent(name,address,phoneNumber);
    console.log(localStorage.getItem("storeName"));
    renderProductComponent(localStorage.getItem("storeName"));
    
}

function getTotalPrice(key,storeName){

    if ( storeName ==="items"){
        //장바구니에서 결제창
        const total=  localStorage.getItem("TotalPrice");
        totalPrice.innerText = `${total}원`;
        return;
    }
    //바로구매로 결제창( 한 종류의 상품 )
    const container = document.getElementById(`${key}`);
    const productPrice =  container.querySelector(".itemsPrice");
    totalPrice.innerText = `${productPrice.innerText.split(":")[1]}원`;
}

function renderUserComponent(name,address,phoneNumber){
    const nameInfo =  document.createElement("div");
    const addressInfo = document.createElement("div");
    
    nameInfo.innerHTML = `<p>${name}</p>`;
    addressInfo.innerHTML = `
        <p>${name}</p>
        <p>${address}</p>
        <p>${phoneNumber}</p>
    `;

    orderedMan.appendChild(nameInfo);
    orderedAdress.appendChild(addressInfo);
}


function createPost(item,key) {
    const priceSum = item.price*item.sales;
    return `
    <div id="${key}">
        <p>${item.name}</p>
        <p>${item.category}</p>
        <p>${item.price}원</p>
        <img src="${item.img}">
        <span class="quantity">${item.sales}개</span>
        <label class="itemsPrice">금액합계:${priceSum}</label>
    </div>
    `;
}



function renderProductComponent(storeName){

    if (window.indexedDB) {
        
        // 1. DB 열기
        const request = indexedDB.open("cart");      
        
        request.onerror = (e)=> console.log(e.target.errorCode);
        request.onsuccess = (e)=> {
        // 2. items 저장소 접근
        const db = request.result;
        const objStore = db.transaction(`${storeName}`,"readwrite").objectStore(`${storeName}`);  
        // 3. items저장소의 레코드 개수 확인
            const cursorRequest = objStore.openCursor();
            cursorRequest.onsuccess =(e)=> {
                // 5. 커서를 사용해 데이터 접근
                let cursor = e.target.result;
                if (cursor) {
                    const value = objStore.get(cursor.key);         
                    value.onsuccess = (e)=> {
                        //6. 상품추가 렌더링 실행
                        productContainer.insertAdjacentHTML("beforeend",createPost(value.result,cursor.key));
                        getTotalPrice(value.result.id,storeName);
                    }
                    // 8. cursor로 순회
                    cursor.continue();                              
                }
            }
        }
    }
}


moveToCartBtn.addEventListener("click",()=>{
    window.location.href="/cart";
});

purchaseBtn.addEventListener("click", async()=>{
    //user -> get으로 user정보를 mongo에서 받고
    //indexeddb에서 -> 상품데이터 가져오고 배열형태로
    //총금액




    if ( localStorage.getItem("storeName") === "nowBuy"){
        //몽고디비에 데이터를 주고
        //로컬의 nowBuy는 비운다.
    }
    const selectedDeliveryMsg = (deliveryMsg.options[deliveryMsg.selectedIndex].innerText);
    // console.log(selectedDeliveryMsg);
    // db에 전달후 로컬db 클리어

    // window.location.href="/";
});


function postDataFromApi(){

    /*
    {
        name,
        address,
        phoneNumber,
        deliveryMsg,
        items : [{
          id
          count
         }]
        payMethod:
        totalPrice:
      }*/
    // const data = { };
    // const user = await Api.post("/api/order",);
}