import * as Api from "../api.js";

const btn = document.querySelector(".moveTocart");
const itemname = document.querySelector(".item-name");
const itemcategory = document.querySelector(".category");
const itemprice = document.querySelector(".price");
const itemimg = document.querySelector(".imageUrl");
// const itemsales = document.querySelector(".sales");
let id; 

getDataFromApi();

// 상세페이지 데이터 get api
async function getDataFromApi(){
    console.log('id : '+ localStorage.getItem("itemDetail"));
    const res = await Api.get('/api/items',`${localStorage.getItem("itemDetail")}`);
    const {_id,name,category,price,imageUrl,sales} = res.data;

    id = _id;
    itemname.innerHTML = name;
    itemcategory.innerHTML = category;
    itemprice.innerHTML = price;
    itemimg.src = imageUrl;
    // itemsales.innerHTML = sales;
}

// 상세페이지에서 indexedDB에 DB생성 및 데이터 저장
// cart 페이지로 이동
function saveData(){
    if (window.indexedDB) {
        const databaseName = "cart";
        const version = 1;
        const request = indexedDB.open(databaseName, version);

        const data = {
            id: id,
            name:itemname.innerHTML,
            category:itemcategory.innerHTML,
            price:Number(itemprice.innerHTML),
            img:itemimg.src,
            sales: 1,
        };
        // console.log(data);

        request.onupgradeneeded = function () {
            // Object Store 생성
            // 데이터베이스 아래 객체 스토어라는 이름으로 또다시 객체를 만들 수 있습니다.
            request.result.createObjectStore("items", { autoIncrement: true });
        };
        
        request.onsuccess = function () {
            const objStore = request.result
                .transaction("items", "readwrite")
                .objectStore("items");
                // transaction : 통신 , items 객체스토어의 권한을 readwrite로 설정
                // objectStore : 오브젝트스토어를 가져옴

            // 동일한 id를 가진 상품이 db에 있다면
            // 상품의 수량을 증가
            // 그렇지 않다면 상품데이터를 추가
            isExist(data,objStore);
        };
        request.onerror = function (event) { alert(event.target.errorCode);}
    }
}

function isExist(data,objStore){
    const requesExists = objStore.get(`${data.id}`);
    requesExists.onerror= function(event){}
    requesExists.onsuccess = function(event) { 
        const record = event.target.result;
        if(record === undefined){ 
            objStore.add(data);
        }
        else{
            record.sales += 1;
            var requestUpdate = objStore.put(record);
            requestUpdate.onerror = function(event) {
                // Do something with the error
            };
            requestUpdate.onsuccess = function(event) {
                // Success - the data is updated!
                console.log("중복상품 수량증가");
            };
        }
    }
}

//btn listener
btn.addEventListener("click", function () {
    saveData();
    const moveTocart = confirm("장바구니로 이동하시겠습니까?");
    if(moveTocart === true){
        window.location.href = "/cart";
    }
});

