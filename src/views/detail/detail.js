import * as Api from "../api.js";

const btn = document.querySelector(".moveTocart");
const itemname = document.querySelector(".itemName");
const itemcategory = document.querySelector(".category");
const itemprice = document.querySelector(".price");
const itemimg = document.querySelector(".imageUrl");
const plusbtn = document.querySelector(".plus");
const minusbtn = document.querySelector(".minus");
const details = document.querySelector("#details");
const buyNowBtn = document.querySelector(".buyNow");

let id;

getDataFromApi();

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
function saveData() {
  if (window.indexedDB) {
    const databaseName = "cart";
    const version = 1;
    const request = indexedDB.open(databaseName, version);

    const data = {
      id: id,
      name: itemname.innerHTML,
      category: itemcategory.innerHTML,
      price: Number(itemprice.innerHTML),
      img: itemimg.src,
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
      isExist(data, objStore);
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
//수량 증가
plusbtn.addEventListener("click", function () {
  const resultElement = document.getElementById("result");
  let number = resultElement.innerText;
  if (number < 10) {
    number = parseInt(number) + 1;
  }
  resultElement.innerText = number;
  updateData(localStorage.getItem("itemDetail"), "plus", number);
});
//수량 감소
plusbtn.addEv;
minusbtn.addEventListener("click", function () {
  const resultElement = document.getElementById("result");
  let number = resultElement.innerText;
  if (number > 1) {
    number = parseInt(number) - 1;
  }
  resultElement.innerText = number;
  updateData(localStorage.getItem("itemDetail"), "minus", number);
});

// 수량변경시 db업데이트
function updateData(key, op, number) {
  // 1. DB 열기
  const request = indexedDB.open("cart");

  request.onerror = (e) => console.log(e.target.errorCode);
  request.onsuccess = (e) => {
    // 2. items 저장소 접근
    const db = request.result;
    const objStore = db.transaction("items", "readwrite").objectStore("items");

    // 3. 변경하고자하는 데이터의 키 값을 가져옴
    const requestChangeCount = objStore.get(`${key}`);

    requestChangeCount.onerror = function (e) {};
    requestChangeCount.onsuccess = function (e) {
      const record = e.target.result;
      if (op === "plus") {
        // 수량증가
        if (record.sales > 9) {
          alert("최대 구매 수량은 10개 입니다.");
        } else if (record.sales === null) {
          alert("null이다!");
        } else {
          record.sales = number;
        }
      } else {
        // 수량감소
        if (record.sales > 1) {
          record.sales = number;
        }
        // } else {
        //   alert("감소했다");
        // }
      }
      console.log(record.sales);
      console.log(key);
      console.log(number);
      console.log(typeof number);
      //데이터 업데이트
      const requestUpdate = objStore.put(record);

      requestUpdate.onerror = function (e) {};
      requestUpdate.onsuccess = function (e) {
        console.log("수량변경완료");
      };
    };
  };
}

//btn listener
btn.addEventListener("click", function () {
  saveData();
  const moveTocart = confirm("장바구니로 이동하시겠습니까?");
  if (moveTocart === true) {
    window.location.href = "/cart";
  }
});

//buyNowBtn listener
buyNowBtn.addEventListener("click", function () {
  saveData();
  const buyNow = confirm("바로 구매하시겠습니까?");
  if (buyNow === true) {
    window.location.href = "/order";
  }
});
