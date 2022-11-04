const main = document.querySelector(".main");
const init = document.querySelector(".init-msg");
const clearbtns = document.querySelector(".clear-btn-container");
const clearAllBtn = document.querySelector(".clear-all");
const clearSelectBtn = document.querySelector(".clear-select");



getIdxedDBValues();

// rendering
function createPost(item,key) {
    const priceSum = item.price*item.sales;
    return `
    <div id="${key}">
        <input type="checkbox" name="${key}" class="checkbox">
        <p >${item.name}</p>
        <p>${item.category}</p>
        <p>${item.price}</p>
        <img src="${item.img}">
        <button class="minus">-</button>
        <span class="quantity">${item.sales}</span>
        <button class ="plus">+</button>
        <label class="items-price">금액합계:${priceSum}</label>
    </div>
    `;
}


// 전체데이터 조회
function getIdxedDBValues() {
    if (window.indexedDB) {
        // 1. DB 열기
        const request = indexedDB.open("cart");      

        request.onerror = (e)=> console.log(e.target.errorCode);
        request.onsuccess = (e)=> {
            // 2. items 저장소 접근
            const db = request.result;
            const objStore = db.transaction("items","readwrite").objectStore("items");  
            // 3. items저장소의 레코드 개수 확인
            const countRequest = objStore.count();
            
            countRequest.onsuccess = function() {
                const recordCount = countRequest.result;
                //4-1. 저장소의 레코드가 0개라면( 장바구니가 비어있다면)
                if(recordCount < 1){
                    init.style.visibility = 'visible';
                    clearbtns.style.visibility = 'hidden';
                    main.innerHTML="";
                }
                //4-2. 저장소에 레코드가 존재한다면
                else{
                    init.style.visibility = 'hidden';
                    clearbtns.style.visibility = 'visible';
                    main.innerHTML="";
                    const cursorRequest = objStore.openCursor();
                    cursorRequest.onsuccess =(e)=> {
                        // 5. 커서를 사용해 데이터 접근
                        let cursor = e.target.result;
                        if (cursor) {
                            const value = objStore.get(cursor.key);         
                            value.onsuccess = (e)=> {
                                //6. 상품추가 렌더링 실행
                                main.insertAdjacentHTML("beforeend",createPost(value.result,cursor.key));
                                // 7. 각 상품에 대한 수량변경 버튼 추가
                                attachBtn(value.result.id);
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

//전체삭제
clearAllBtn.addEventListener("click",function(){
    // 1. db 열기
    const request = window.indexedDB.open('cart');     
    request.onerror =(e)=> console.log(e.target.errorCode);
    request.onsuccess =(e)=> {
        // 2. items 저장소 접근
        const db = request.result;
        const objStore  = db.transaction('items', 'readwrite').objectStore('items'); 
        // 3. 전체 삭제
        const objStoreRequest = objStore.clear();           
        objStoreRequest.onsuccess =(e)=> {
            console.log('cleared');
        }
    }
    getIdxedDBValues();
})

//선택삭제
clearSelectBtn.addEventListener("click",function(){
    // 1. db 열기
    const request = window.indexedDB.open('cart');     
    request.onerror =(e)=> console.log(e.target.errorCode);
    request.onsuccess =(e)=> {
        // 2. items 저장소 접근
        const db = request.result;
        const objStore = db.transaction('items', 'readwrite').objectStore('items');
        const keys = getCheckboxValue();
        
        keys.forEach((key)=>{
            const objStoreRequest = objStore.delete(key);       // 3. 삭제하기 
            objStoreRequest.onsuccess =(e)=> {
                console.log('deleted');
            }
        });
    }
    getIdxedDBValues();
})

// checked된 checkbox의 키 값들을 가져오는 함수
function getCheckboxValue(){
    //node여서 filter가 안먹음..
    let keys = [];
    const checkboxs = document.querySelectorAll(".checkbox");
    
    checkboxs.forEach( checkbox => {
        if ( checkbox.checked == true){keys.push(checkbox.name);}
    });
    return keys;
}

//수량변경 버튼 : addevnetListener
function attachBtn(key){   
    //parentElement
    const container = document.getElementById(`${key}`);
    //plus, minuy button
    const plusbtn = container.childNodes[15];
    const minusbtn = container.childNodes[11];

    plusbtn.addEventListener("click" ,()=>{
        updateData(key,"plus");
        getIdxedDBValues();
    });

    minusbtn.addEventListener("click" ,()=>{
        updateData(key,"minus");
        getIdxedDBValues();
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

        // 3.변경하고자하는 데이터의 키 값을 가져옴 
        const requestChangeCount = objStore.get(`${key}`);

        requestChangeCount.onerror= function(e){}
        requestChangeCount.onsuccess = function(e) { 
            const record = e.target.result;
            if(op==="plus"){
                // 수량증가
                if(record.sales > 9){alert("최대 구매 수량은 10개 입니다.");}
                else{record.sales += 1;}
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
