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
const text = document.querySelector("#text");
const btnSave = document.querySelector(".Save");
const btnEdit = document.querySelector(".Edit");

let id;
// let itemId;
let delReviewId;

getDataFromApi();
showReview(localStorage.getItem("itemDetail"));

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
  // itemId = localStorage.getItem("itemDetail");
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
function saveData(salseCount, storeName) {
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
      localStorage.setItem("storeName", storeName);
      const objStore = request.result
        .transaction(`${storeName}`, "readwrite")
        .objectStore(`${storeName}`);
      // transaction : 통신 , items 객체스토어의 권한을 readwrite로 설정
      // objectStore : 오브젝트스토어를 가져옴

      // 동일한 id를 가진 상품이 db에 있다면
      // 상품의 수량을 증가
      // 그렇지 않다면 상품데이터를 추가
      if (storeName == "items") {
        isExist(data, objStore);
      } else {
        objStore.add(data);
      }
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
  saveData(salseCount, "items");
  const moveTocart = confirm(
    "상품이 장바구니에 담겼습니다.\n장바구니로 이동하시겠습니까?"
  );
  if (moveTocart === true) {
    window.location.href = "/cart";
  }
});

//buyNowBtn listener
buyNowBtn.addEventListener("click", function () {
  if (sessionStorage.getItem("loggedIn") === "true") {
    const buyNow = confirm("바로 구매하시겠습니까?");
    if (buyNow === true) {
      console.log("바로구매");
      saveData(salseCount, "nowBuy");
      localStorage.setItem("keys", localStorage.getItem("itemDetail"));
      window.location.href = "/order";
      return;
    }
    return;
  }
  alert("로그인을 먼저 해주세요.");
});

//리뷰 작성
btnSave.addEventListener("click", async (e) => {
  e.preventDefault();
  const review = text.value;
  console.log(review);
  // 5글자 이상 글자 수 검사
  if (review.length < 5) {
    return alert("리뷰를 5글자 이상 작성해주세요");
  }
  // 검사를 통과했으면 요청 보냄
  const res = await Api.post("/api/comments", {
    text: review,
    itemId: localStorage.getItem("itemDetail"),
  });
  // 작성 후 작성창 닫기
  const hidden = document.getElementById("text");
  hidden.style.display = "none";
  // 작성 후 다시 렌더링
  showReview(localStorage.getItem("itemDetail"));
  // save 창 막기
  btnSave.addEventListener("click", async (e) => {
    e.preventDefault();
    alert(`댓글이 작성되었습니다.`);
  });
});

//리뷰 확인
async function showReview(아이템아이디) {
  const reviewData = await Api.get(`/api/comments/${아이템아이디}`);
  console.log(reviewData);
  for (let i = 0; i < reviewData.data.length; i++) {
    //리뷰 렌더링
    const momDiv = document.createElement("div");
    momDiv.setAttribute("class", "momDiv");
    const reviewDiv = document.createElement("div");
    reviewDiv.setAttribute("class", "reviewDiv");
    reviewDiv.textContent = `${reviewData.data[i].name}: ${reviewData.data[i].text}`;
    // reviewDiv.textContent = `${reviewData.data[i].name} : ${reviewData.data[i].text}`;
    const dateDiv = document.createElement("div");
    dateDiv.setAttribute("class", "dateDiv");
    let rawDate = reviewData.data[i].createdAt;
    // itemId = 아이디 가져오기
    // console.log(rawDate);
    // let date = new Date(rawDate);
    // console.log(date);
    // console.log(typeof date);
    // let Date = date.toLocaleString();
    // console.log(Date);
    dateDiv.textContent = rawDate;

    const btnDiv = document.createElement("div");
    btnDiv.setAttribute("class", "btnDiv");
    const btnEdit = document.createElement("button");
    // btnEdit.setAttribute("class", "btnedit");
    // btnEdit.textContent = "수정";
    const btnDelete = document.createElement("button");
    btnDelete.setAttribute("class", "btndelete");
    btnDelete.textContent = "삭제";

    // //수정버튼 이벤트리스너
    // btnEdit.addEventListener("click", () =>
    //   editRv(text.value, localStorage.getItem("reviewId"))
    // );
    //삭제버튼 리뷰아이디 잘못 넣는 중
    //삭제버튼 이벤트리스너
    btnDelete.addEventListener("click", () =>
      deleteRv(
        localStorage.getItem("itemDetail"),
        localStorage.getItem("reviewId")
      )
    );

    // btnDiv.appendChild(btnEdit);
    btnDiv.appendChild(btnDelete);
    momDiv.appendChild(btnDiv);
    momDiv.appendChild(reviewDiv);
    momDiv.appendChild(dateDiv);
    reviewList.appendChild(momDiv);
  }
}

// 댓글 삭제
async function deleteRv(itemId, commentId) {
  if (confirm(`댓글을 삭제하시겠습니까?`)) {
    console.log(localStorage.getItem("reviewId"));
    console.log(localStorage.getItem("itemDetail"));
    const res = await Api.delete("/api/comments", "", {
      itemId,
      commentId,
    });
    // 이전 데이터 삭제(안하면 이전 데이터가 계속 쌓임)
    while (reviewList.hasChildNodes()) {
      reviewList.removeChild(reviewList.firstChild);
    }
    showReview(localStorage.getItem("itemDetail"));
    return;
  } else {
    return false;
  }
}

// 댓글 수정
btnEdit.addEventListener("click", async (e) => {
  e.preventDefault();
  // 댓글 수정 확인
  if (confirm(`댓글을 수정하시겠습니까?`)) {
    const review = text.value;
    if (review.length >= 5) {
      const res = await Api.patch("/api/comments", "", {
        fixText: review,
        commentId: localStorage.getItem("reviewId"),
      });
      showReview(localStorage.getItem("itemDetail"));
    } else {
      return alert("댓글을 5자이상 작성해주세요");
    }
  }
});

// async function editRv(fixText, commentId) {
//   // 댓글 수정 확인
//   if (fixText.length >= 5) {
//     const editReview = await Api.patch("/api/comments", "", {
//       fixText,
//       commentId,
//     });
//     showReview(localStorage.getItem("itemDetail"));
//   } else {
//     return alert("댓글을 5자이상 작성해주세요");
//   }
// }
// // ownCmts 배열로 가진 댓글들을 담아서 보내줄거임 -> 얘를 가지고 Array.includes(cmtId) 있으면 true, flase
// 렌더링에서 저 조건을 해서 true면 버튼 생성하는 로직 생성
// 아니면 그냥 냅둠
