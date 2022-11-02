const main = document.querySelector(".main");
const init = document.querySelector(".init-msg");
const clearbtns = document.querySelector(".clear-btn-container");
const clearAllBtn = document.querySelector(".clear-all");
const clearSelectBtn = document.querySelector(".clear-select");
const checkbox = document.querySelector("#check");

getIdxedDBValues();


function createPost(item,key) {
    // const modalEl = document.createElement('input');
    // modalEl.setAttribute("type","checkbox");
    // modalEl.setAttribute("value", `${key}`);
    return `
    <div style="border 1px black">
        <input type="checkbox" value="${key}" >
        <p onclick="selected()">${item.name}</p>
        <p>${item.category}</p>
        <p>${item.price}</p>
        <img src="${item.img}">
        <p>${item.sales}</p>
        <button class="plus">+</button>
        <label class="quantity">1</label>
        <button class="minus">-</button>
        <label class="total-price">금액합계:${item.price}</label>
    </div>
    `;
}

// function selected(){
//     console.log('onclick');

// }

// 전체데이터 조회
function getIdxedDBValues() {
    if (window.indexedDB) {
        const request = indexedDB.open("cart");      // 1. DB 열기

        request.onerror = (e)=> console.log(e.target.errorCode);
        request.onsuccess = (e)=> {
            const db = request.result;
            const objStore = db.transaction("items").objectStore("items");  // 2. name 저장소 접근
            const countRequest = objStore.count();
            
            countRequest.onsuccess = function() {
                const recordCount = countRequest.result;
                // console.log(recordCount); 
                if(recordCount < 1){
                    init.style.visibility = 'visible';
                    clearbtns.style.visibility = 'hidden';
                }
                else{
                    init.style.visibility = 'hidden';
                    clearbtns.style.visibility = 'visible';

                    const cursorRequest = objStore.openCursor();
                    cursorRequest.onsuccess =(e)=> {
                        let cursor = e.target.result;
                        if (cursor) {
                            const value = objStore.get(cursor.key);         // 3. 커서를 사용해 데이터 접근
                            value.onsuccess =(e)=> {
                                
                                main.innerHTML += `
                                <div style="border 1px black">
                                    <input type="checkbox" value="${cursor.key}" >
                                    <p onclick="selected()">${value.result.name}</p>
                                    <p>${value.result.category}</p>
                                    <p>${value.result.price}</p>
                                    <img src="${value.result.img}">
                                    <p>${value.result.sales}</p>
                                    <button class="plus">+</button>
                                    <label class="quantity">1</label>
                                    <button class="minus">-</button>
                                    <label class="total-price">금액합계:${value.result.price}</label>
                                </div>
                                `;
                                
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
        const transaction  = request.result.transaction('items', 'readwrite');
        transaction.onerror =(e)=> console.log('fail');
        transaction.oncomplete =(e)=> console.log('success');

        const objStore = transaction.objectStore('items');   // 2. name 저장소 접근
        const objStoreRequest = objStore.clear();           // 3. 전체 삭제
        objStoreRequest.onsuccess =(e)=> {
            console.log('cleared');
        }
    }
})

//선택삭제
clearSelectBtn.addEventListener("click",function(){
    const request = window.indexedDB.open('cart');     // 1. db 열기
    request.onerror =(e)=> console.log(e.target.errorCode);

    request.onsuccess =(e)=> {
        const db = request.result;
        const transaction = db.transaction('items', 'readwrite');
        transaction.onerror =(e)=> console.log('fail');
        transaction.oncomplete =(e)=> console.log('success');
    
        const objStore = transaction.objectStore('items');   // 2. name 저장소 접근
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

