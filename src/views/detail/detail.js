import * as Api from "../api.js";

const cartBtn = document.querySelector(".moveTocart");
const itemname = document.querySelector(".itemName");
const itemcategory = document.querySelector(".category");
const itemprice = document.querySelector(".price");
const itemimg = document.querySelector(".imageUrl");
const details = document.querySelector("#details");
const buyNowBtn = document.querySelector(".buyNow");
const plusBtn = document.querySelector(".plus");
const minusBtn = document.querySelector(".minus");
const salseCount = document.querySelector(".salseCount");

let id;

getDataFromApi();

plusBtn.addEventListener("click", () => {
    if (parseInt(salseCount.innerText) >= 10) {
        alert("최대 구매 수량은 10개 입니다.");
        return;
    } else {
        salseCount.innerText = parseInt(salseCount.innerText) + 1;
    }
});

minusBtn.addEventListener("click", () => {
    if (parseInt(salseCount.innerText) <= 1) {
        alert("최소 구매 수량은 1개 입니다.");
        return;
    } else {
        salseCount.innerText = parseInt(salseCount.innerText) - 1;
    }
});

// 상세페이지 데이터 get api
async function getDataFromApi() {
    console.log("id : " + localStorage.getItem("itemDetail"));
    const res = await Api.get(
        "/api/items",
        `${localStorage.getItem("itemDetail")}`
    );
    const { _id, name, category, price, imageUrl, itemDetail } = res.data;

    id = _id;
    itemname.innerHTML = name;
    itemcategory.innerHTML = category;
    itemprice.innerHTML = price;
    itemimg.src = imageUrl;
    details.innerHTML = itemDetail;
}

// 상세페이지에서 indexedDB에 DB생성 및 데이터 저장
// cart 페이지로 이동
function saveData(salseCount,storeName) {
    if (window.indexedDB) {
        const databaseName = "cart";
        const version = 1;
        const request = indexedDB.open(databaseName, version);

        const data = {
            id: id,
            name: itemname.innerHTML,
            category: itemcategory.innerHTML,
            price: parseInt(itemprice.innerHTML),
            img: itemimg.src,
            sales: parseInt(salseCount.innerText),
        };

        request.onupgradeneeded = function () {
        // Object Store 생성
        // 데이터베이스 아래 객체 스토어라는 이름으로 또다시 객체를 만들 수 있습니다.
            request.result.createObjectStore("items", { autoIncrement: true });
            request.result.createObjectStore("nowBuy", { keyPath: "id" });
        };

        request.onsuccess = function () {
            localStorage.setItem("storeName",storeName);
            const objStore = request.result
                .transaction(`${storeName}`, "readwrite")
                .objectStore(`${storeName}`);
            // transaction : 통신 , items 객체스토어의 권한을 readwrite로 설정
            // objectStore : 오브젝트스토어를 가져옴

            // 동일한 id를 가진 상품이 db에 있다면
            // 상품의 수량을 증가
            // 그렇지 않다면 상품데이터를 추가
            if(storeName == "items") { isExist(data,objStore);}
            else{objStore.add(data);}
        };
        request.onerror = function (event) {
            alert(event.target.errorCode);
        };
    }
}

function isExist(data, objStore) {
    const requesExists = objStore.get(`${data.id}`);
    requesExists.onerror = function (event) {};
    requesExists.onsuccess = function (event) {
        const record = event.target.result;
        if (record === undefined) {
            objStore.add(data);
            return;
        } else {
            record.sales += 1;
            var requestUpdate = objStore.put(record);
            requestUpdate.onerror = function (event) {
            // Do something with the error
            };
            requestUpdate.onsuccess = function (event) {
            // Success - the data is updated!
                console.log("중복상품 수량증가");
            };
        }
    };
}

//carBtn listener
cartBtn.addEventListener("click", function () {
    console.log(salseCount);
    console.log(salseCount.innerText);
    saveData(salseCount,"items");
    const moveTocart = confirm("상품이 장바구에 담겼습니다.\n장바구니로 이동하시겠습니까?");
    if (moveTocart === true) {
        window.location.href = "/cart";
    }
});

//buyNowBtn listener
buyNowBtn.addEventListener("click", function () {
    if (sessionStorage.getItem("loggedIn") === "true") {
        const buyNow = confirm("바로 구매하시겠습니까?");
        if(buyNow === true) {
            console.log("바로구매");
            saveData(salseCount,"nowBuy");
            localStorage.setItem("keys", localStorage.getItem("itemDetail"));
            window.location.href = "/order";
            return;
        }
        return;
    }
    alert("로그인을 먼저 해주세요.");
});
