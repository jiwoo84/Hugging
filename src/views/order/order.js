import * as Api from "/api.js";

const orderedMan= document.querySelector(".orderedMan");
const orderedAdress= document.querySelector(".orderedAdress");
const moveToCartBtn = document.querySelector(".moveToCart");
const productContainer = document.querySelector(".productContainer");
const orderPrice=document.querySelector(".totalPrice");
const purchaseBtn=document.querySelector(".purchase");
const deliveryMessage = document.querySelector(".deliveryMsg");

let items = [];
let totalPrice = 0;
getDataFromApi();

async function getDataFromApi() {
    const user = await Api.get("/api/users","mypage");
    const {name,address,phoneNumber} = user.data;
    renderUserComponent(name,address,phoneNumber);
    renderProductComponent(localStorage.getItem("storeName"));
    
}

function getTotalPrice(key,storeName){

    if ( storeName ==="items"){
        //장바구니에서 결제창
        totalPrice=  localStorage.getItem("TotalPrice");
        orderPrice.innerText = `${totalPrice}원`;
        return;
    }
    //바로구매로 결제창( 한 종류의 상품 )
    const container = document.getElementById(`${key}`);
    const productPrice =  container.querySelector(".itemsPrice");
    totalPrice = parseInt(productPrice.innerText.split(":")[1]);
    orderPrice.innerText = `${totalPrice}원`;
}

function renderUserComponent(name,address,phoneNumber){
    const nameInfo =  document.createElement("div");
    const addressInfo = document.createElement("div");
    addressInfo.setAttribute("class","addressInfo");
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
    <div id="${key}" class = "card">
        <img src="${item.img}">
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
                        const {id} = value.result;
                        const count = value.result.sales;
                        items.push({id,count});
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
    //indexeddb에서 -> 상품데이터 가져오고 배열형태로
    //총금액
    const storeName =  localStorage.getItem("storeName");
    const user = await Api.get("/api/users","mypage");
    const {name,address,phoneNumber} = user.data;
    const deliveryMsg = (deliveryMessage.options[deliveryMessage.selectedIndex].innerText);
    const card = document.querySelector('input[name="radio"]').checked;
    let payMethod;
    if(card){
        payMethod = "카드결제";
    }else{
        payMethod = "무통장입금";
    }

    const postData = {name,address,phoneNumber,deliveryMsg,items,payMethod,totalPrice}
    console.log(postData);
    await Api.post("/api/orders/", postData);

    //주문완료후 indexedDB 비우기
    const request = window.indexedDB.open("cart");     
    request.onerror =(e)=> console.log(e.target.errorCode);
    request.onsuccess =(e)=> {
        const db = request.result;
        const objStore  = db.transaction(`${storeName}`, "readwrite").objectStore(`${storeName}`); 
        const objStoreRequest = objStore.clear();           
        objStoreRequest.onsuccess =(e)=> {
            console.log("cleared");
        }
    }

    window.location.href="/";
});

