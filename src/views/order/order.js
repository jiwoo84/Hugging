import * as Api from "/api.js";

const orderedMan= document.querySelector(".orderedMan");
const orderedAdress= document.querySelector(".orderedAdress");
const moveToCartBtn = document.querySelector(".moveToCart");
const productContainer = document.querySelector(".productContainer");
const totalPriceContainer=document.querySelector(".totalPrice")
const purchaseBtn=document.querySelector(".purchase")
const deliveryMsg = document.querySelector(".deliveryMsg");


getDataFromApi();

async function getDataFromApi() {
    const user = await Api.get("/api/users","mypage");
    const {name,address,phoneNumber} = user.data;
    renderUserComponent(name,address,phoneNumber);
    renderProductComponent();
    getTotalPrice();
}

function getTotalPrice(){
    const totalPrice =  localStorage.getItem("TotalPrice");
    const total =  document.createElement("p");
    total.innerText = totalPrice;
    totalPriceContainer.appendChild(total);
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
        <span class="quantity">${item.sales}개</span
        <label class="items-price">금액합계:${priceSum}</label>
    </div>
    `;
}



function renderProductComponent(){

    if (window.indexedDB) {
        
        // 1. DB 열기
        const request = indexedDB.open("cart");      
        
        request.onerror = (e)=> console.log(e.target.errorCode);
        request.onsuccess = (e)=> {
        // 2. items 저장소 접근
        const db = request.result;
        const objStore = db.transaction("items","readwrite").objectStore("items");  
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
    const selectedDeliveryMsg = (deliveryMsg.options[deliveryMsg.selectedIndex].innerText);
    
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