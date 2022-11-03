const main = document.querySelector(".main");
const init = document.querySelector(".init-msg");
const clearbtns = document.querySelector(".clear-btn-container");
const clearAllBtn = document.querySelector(".clear-all");
const clearSelectBtn = document.querySelector(".clear-select");



getIdxedDBValues();
// addevent();

function createPost(item,key) {
    const priceSum = item.price*item.sales;
    return `
    <div style="border 1px black">
        <input type="checkbox" value="${key}" class="checkbox">
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
        const request = indexedDB.open("cart");      // 1. DB 열기

        request.onerror = (e)=> console.log(e.target.errorCode);
        request.onsuccess = (e)=> {
            const db = request.result;
            const objStore = db.transaction("items","readwrite").objectStore("items");  // 2. name 저장소 접근
            const countRequest = objStore.count();
            
            countRequest.onsuccess = function() {
                const recordCount = countRequest.result;
                if(recordCount < 1){
                    init.style.visibility = 'visible';
                    clearbtns.style.visibility = 'hidden';
                }
                else{
                    init.style.visibility = 'hidden';
                    clearbtns.style.visibility = 'visible';
                    main.innerHTML="";
                    const cursorRequest = objStore.openCursor();
                    cursorRequest.onsuccess =(e)=> {
                        let cursor = e.target.result;
                        if (cursor) {
                            const value = objStore.get(cursor.key);         // 3. 커서를 사용해 데이터 접근
                            value.onsuccess = (e)=> {
                                // let box = document.createElement ('div');
                                main.insertAdjacentHTML("beforeend",createPost(value.result,cursor.key));
                                // main.appendChild(box);
                                attachBtn(value.result);
                            }
                            cursor.continue();                              // 4. cursor로 순회
                            
                        }
                    }
                }
            }
        }
    }
}

//전체삭제
clearAllBtn.addEventListener("click",function(){
    const request = window.indexedDB.open('cart');     // 1. db 열기
    request.onerror =(e)=> console.log(e.target.errorCode);
    request.onsuccess =(e)=> {
        const db = request.result;
        const objStore  = db.transaction('items', 'readwrite').objectStore('items'); // 2. name 저장소 접근
        const objStoreRequest = objStore.clear();           // 3. 전체 삭제
        objStoreRequest.onsuccess =(e)=> {
            console.log('cleared');
        }
    }
    getIdxedDBValues();
})

//선택삭제
clearSelectBtn.addEventListener("click",function(){
    const request = window.indexedDB.open('cart');     // 1. db 열기
    request.onerror =(e)=> console.log(e.target.errorCode);
    request.onsuccess =(e)=> {
        const db = request.result;
        const objStore = db.transaction('items', 'readwrite').objectStore('items');// 2. name 저장소 접근
        // const keys = getCheckboxValue();
        // console.log(keys);
        // keys.forEach((key)=>{
        //     const objStoreRequest = objStore.delete(key);       // 3. 삭제하기 
        //     objStoreRequest.onsuccess =(e)=> {
        //         console.log('deleted');
        //     }
        // })
    }
})

// const plusbtns = document.querySelectorAll('.plus');
// const minusbtn = document.querySelectorAll('.minus');
// console.log("global",plusbtns,minusbtn)

function attachBtn(data){
    const plusbtns = document.querySelectorAll('.plus');
    const minusbtns = document.querySelectorAll('.minus');
    console.log(plusbtns,minusbtns)

    plusbtns.forEach(plusbtn =>{
        plusbtn.addEventListener("click" ,()=>{
            updateData(data,"plus");
            getIdxedDBValues();
        });
    });
    minusbtns.forEach(minusbtn =>{
        minusbtn.addEventListener("click" ,()=>{
            updateData(data,"minus");
            getIdxedDBValues();
        });
    });
}



function updateData(data,op){
    const request = indexedDB.open("cart");      // 1. DB 열기

    request.onerror = (e)=> console.log(e.target.errorCode);
    request.onsuccess = (e)=> {
        const db = request.result;
        const objStore = db.transaction("items","readwrite").objectStore("items");  // 2. name 저장소 접근

        const requestChangeCount = objStore.get(`${data.id}`);
        requestChangeCount.onerror= function(e){}
        requestChangeCount.onsuccess = function(e) { 
            const record = e.target.result;
            if(op==="plus"){
                if(record.sales > 9){alert("최대 구매 수량은 10개 입니다.");}
                else{record.sales += 1;}
            }
            else{
                if(record.sales > 1){record.sales -= 1;}
                else{alert("삭제버튼을 이용해 삭제하세요");}
            }
            const requestUpdate = objStore.put(record);
            
            requestUpdate.onerror = function(e) {
                // Do something with the error
            };
            requestUpdate.onsuccess = function(e) {
                // Success - the data is updated!
                console.log("수량변경");
            };
        }
    }
}
