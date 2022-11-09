const main = document.querySelector(".main");
const init = document.querySelector(".init-msg");
const clearbtns = document.querySelector(".clear-btn-container");
const clearAllBtn = document.querySelector(".clear-all");
const clearSelectBtn = document.querySelector(".clear-select");
const purchaseBtn = document.querySelector(".moveTopurchase");

let totalPrice =0;

getIdxedDBValues();


// rendering
function createPost(item,key) {
    const priceSum = item.price*item.sales;
    return `
    <div id="${key}" class = "card">
        <img src="${item.img}" class ="productImg">
        <div class="productInfo">
            <input type="checkbox" name="${key}" class="checkbox" checked>
            <p class="name">${item.name}</p>
            <p class="category">${item.category}</p>
            <p class="price">${item.price}</p>
            <button class="minus">-</button>
            <span class="quantity">${item.sales}</span>
            <button class ="plus">+</button>
            <p class="productPrice">금액합계 : ${priceSum}</p>
        </div>
    </div>
    `;
}

// 전체데이터 조회
function getIdxedDBValues() {
    totalPrice = 0;
    if (window.indexedDB) {
        // 1. DB 열기
        const request = indexedDB.open("cart");      

        request.onerror = (e)=> console.log(e.target.errorCode);
        request.onsuccess = (e)=> {
            // 2. items 저장소 접근
            const db = request.result;
            const objStore = db.transaction("items","readwrite").objectStore("items");  
            // 3. items 레코드 개수 확인
            const countRequest = objStore.count();
            
            countRequest.onsuccess = function() {
                const recordCount = countRequest.result;
                //4-1. 저장소의 레코드가 0개라면( 장바구니가 비어있다면)
                if(recordCount < 1){
                    init.style.visibility = "visible";
                    clearbtns.style.visibility = "hidden";
                    purchaseBtn.style.visibility ="hidden";
                    main.innerHTML="";
                }
                //4-2. 저장소에 레코드가 존재한다면
                else{
                    
                    init.style.visibility = "hidden";
                    clearbtns.style.visibility = "visible";
                    purchaseBtn.style.visibility = "visible";
                    main.innerHTML="";
                    
                    const cursorRequest = objStore.openCursor();
                    cursorRequest.onsuccess =(e)=> {
                        // 5. 커서를 사용해 데이터 접근
                        let cursor = e.target.result;
                        if (cursor) {
                            const value = objStore.get(cursor.key);         
                            value.onsuccess = (e)=> {
                                totalPrice += value.result.price*value.result.sales; 
                                
                                //6. 상품추가 렌더링 실행
                                main.insertAdjacentHTML("beforeend",createPost(value.result,cursor.key));
                                // 7. 각 상품에 대한 수량변경 버튼 추가
                                attachBtn(value.result.id);
                                // 상품상세페이지로 이동버튼
                                moveTodetailBtn(value.result.id);
                                // 결제금액
                                getTotalPrice();
                            }
                            // 8. cursor로 순회
                            cursor.continue();                              
                            
                        }
                        
                    }
                }
            }
        }
    }
}

// 총 금액 저장
function setTotalPrice(){
    localStorage.setItem("TotalPrice", totalPrice);
}

//결제버튼 텍스트
function getTotalPrice(){ //1
    // totalPrice += productPrice;
    const msg = `${totalPrice}원 결제하기`;
    purchaseBtn.value = msg;
    setTotalPrice();
}

// checked된 checkbox의 키 값들을 가져오는 함수
function getCheckboxValue(){
    let keys = [];
    const checkboxs = document.querySelectorAll(".checkbox");
    
    checkboxs.forEach( checkbox => {
        if ( checkbox.checked === true){keys.push(checkbox.name);}
    });
    return keys;
}



// 상품의 이미지 클릭하면 상세페이지로 이동
function moveTodetailBtn(key){
    const container = document.getElementById(`${key}`);
    const imgTag = container.querySelector(".productImg");
    imgTag.addEventListener("click", ()=>{
        localStorage.setItem("itemDetail",key);
        location.href = "/detail";
    });
}

//수량변경 버튼 : addevnetListener
function attachBtn(key){   
    //parentElement
    const container = document.getElementById(`${key}`);
    //plus, minuy button
    const plusbtn = container.querySelector(".plus");
    const minusbtn = container.querySelector(".minus");
    const checkbox = container.querySelector(".checkbox");

    plusbtn.addEventListener("click" ,()=>{
        updateData(key,"plus");
        getIdxedDBValues();
    });

    minusbtn.addEventListener("click" ,()=>{
        updateData(key,"minus");
        getIdxedDBValues();
    });
    checkbox.addEventListener("change" ,()=>{
        const productPrice = container.querySelector(".productPrice");
        const price = productPrice.innerText.split(":")[1].trim();

        if ( checkbox.checked === true){
            console.log(price);
            totalPrice += Number(price);
            getTotalPrice();
        }
        else{
            totalPrice -= Number(price);
            getTotalPrice();
        }
    });
}


// 수량변경시 db업데이트
function updateData(key,op){
    // 1. DB 열기
    const request = indexedDB.open("cart");      

    request.onerror = (e)=> console.log(e.target.errorCode);
    request.onsuccess = (e)=> {
        // 2. items 저장소 접근
        const db = request.result;
        const objStore = db.transaction("items","readwrite").objectStore("items");  

        // 3. 변경하고자하는 데이터의 키 값을 가져옴 
        const requestChangeCount = objStore.get(`${key}`);

        requestChangeCount.onerror= function(e){}
        requestChangeCount.onsuccess = function(e) { 
            const record = e.target.result;
            if(op==="plus"){
                // 수량증가
                if(record.sales > 9){alert("최대 구매 수량은 10개 입니다.");}
                else {record.sales += 1; }
                
            }
            else{
                // 수량감소
                if(record.sales > 1){record.sales -= 1;}
                else{alert("삭제버튼을 이용해 삭제하세요");}
                
            }
            //데이터 업데이트
            const requestUpdate = objStore.put(record);
            
            requestUpdate.onerror = function(e) {};
            requestUpdate.onsuccess = function(e) {
                console.log("수량변경완료");
            };
        }
    }
}

//db레코드 전체삭제
clearAllBtn.addEventListener("click",function(){
    // 1. db 열기
    const request = window.indexedDB.open("cart");     
    request.onerror =(e)=> console.log(e.target.errorCode);
    request.onsuccess =(e)=> {
        // 2. items 저장소 접근
        const db = request.result;
        const objStore  = db.transaction("items", "readwrite").objectStore("items"); 
        // 3. 전체 삭제
        const objStoreRequest = objStore.clear();           
        objStoreRequest.onsuccess =(e)=> {
            console.log("cleared");
        }
    }
    getIdxedDBValues();
})

//db레코드 선택삭제
clearSelectBtn.addEventListener("click",function(){
    // 1. db 열기
    const request = window.indexedDB.open("cart");     
    request.onerror =(e)=> console.log(e.target.errorCode);
    request.onsuccess =(e)=> {
        // 2. items 저장소 접근
        const db = request.result;
        const objStore = db.transaction("items", "readwrite").objectStore("items");
        const keys = getCheckboxValue();
        
        keys.forEach((key)=>{
            const objStoreRequest = objStore.delete(key);       // 3. 삭제하기 
            objStoreRequest.onsuccess =(e)=> {
                console.log("deleted");
            }
        });
    }
    getIdxedDBValues();
});

//결제창으로 이동
purchaseBtn.addEventListener("click",function(){
    if (purchaseBtn.innerText[0]==="0" || purchaseBtn.value[0]==="0"){
        alert("상품을 선택하세요.");
        return ;
    }
    if (localStorage.getItem("loggedIn") === "true" ) {
        localStorage.setItem("storeName","items");
        localStorage.setItem("keys",getCheckboxValue());
        location.href = "/order";
        return;
    }
    alert("로그인을 먼저 해주세요.");
});
