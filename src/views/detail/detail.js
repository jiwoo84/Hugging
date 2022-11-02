import * as Api from "../api.js";

const btn = document.querySelector(".moveTocart");
const itemname = document.querySelector(".item-name");
const itemcategory = document.querySelector(".category");
const itemprice = document.querySelector(".price");
const itemimg = document.querySelector(".imageUrl");
const itemsales = document.querySelector(".sales");

getDataFromApi();


async function getDataFromApi(){
    console.log('id : '+ localStorage.getItem("itemDetail"));
    const res = await Api.get('/api/items',`${localStorage.getItem("itemDetail")}`);
    const {id,name,category,price,imageUrl,sales} = res.data;
    console.log(res.data);

    itemname.innerHTML = name;
    itemcategory.innerHTML = category;
    itemprice.innerHTML = price;
    itemimg.innerHTML = imageUrl;
    // itemsales.innerHTML = sales;
}

// 상세페이지에서 indexedDB에 DB생성 및 데이터 저장
btn.addEventListener("click", function () {
    if (window.indexedDB) {
        const databaseName = "cart";
        const version = 1;
        const request = indexedDB.open(databaseName, version);

        const data = {
            name: itemname,
            category:category,
            price:Number(price),
            img:img,
            sales:Number(sales)
        };
        console.log(data)

        
        request.onupgradeneeded = function () {
            // Object Store 생성
            // 데이터베이스 아래 객체 스토어라는 이름으로 또다시 객체를 만들 수 있습니다.
            request.result.createObjectStore("items", { autoIncrement: true });
        };
        
        request.onsuccess = function () {
            const store = request.result
                .transaction("items", "readwrite")
                .objectStore("items");
                // transaction : 통신 , items 객체스토어의 권한을 readwrite로 설정
                // objectStore : 오브젝트스토어를 가져옴
            store.add(data);
        };
        request.onerror = function (event) { alert(event.target.errorCode);}
    }
});
