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
const content_bntBox = document.querySelector(".content_bntBox");
const btnEdit = document.querySelector(".Edit");

let id;

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
  const res = await Api.get(
    "/api/items",
    `${localStorage.getItem("itemDetail")}`
  );

  const { _id, name, category, price, imageUrl, itemDetail } = res.data;

  id = _id;
  itemname.innerHTML = name;
  itemcategory.innerHTML = category;
  itemprice.innerHTML = `${price} 원`;
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
  if (localStorage.getItem("loggedIn") === "true") {
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

//리뷰 렌더링
async function showReview(아이템아이디) {
  // 이전 데이터 삭제(안하면 이전 데이터가 계속 쌓임)
  reviewList.innerHTML = "";

  // 입력창 비우기
  text.value = "";

  const reviewData = await Api.get(`/api/comments/${아이템아이디}`);

  const grandMomDiv = document.createElement("div");
  grandMomDiv.setAttribute("id", reviewData.ownCmt);

  for (let i = 0; i < reviewData.data.length; i++) {
    //리뷰 렌더링
    // 이전 데이터 삭제
    reviewList.innerHTML = "";
    // 댓글작성자주인(0개/1개): owncmt / 댓글작성자id(여러개): cmtId
    const momDiv = document.createElement("div");
    momDiv.setAttribute("class", "momDiv");
    const reviewDiv = document.createElement("div");
    reviewDiv.setAttribute("class", "reviewDiv");
    reviewDiv.innerHTML = `
      <p class="reviewDiv_name">${reviewData.data[i].name}</p>
      <p class="reviewDiv_text">${reviewData.data[i].text}</p>
    `;
    const dateDiv = document.createElement("div");
    dateDiv.setAttribute("class", "dateDiv");
    let rawDate = reviewData.data[i].createdAt;
    let date = Date.parse(rawDate);
    let result = new Date(date);
    result = result.toString();
    let resultDate = result.slice(0, 25);
    dateDiv.textContent = `${resultDate}`;

    momDiv.appendChild(reviewDiv);
    momDiv.appendChild(dateDiv);

    // 조건부 버튼 구현: 내가 적은 댓글에만 버튼 생성
    const ownCmt = reviewData.ownCmt;

    if (ownCmt !== "" && ownCmt === reviewData.data[i].cmtId) {
      const btnDiv = document.createElement("div");
      btnDiv.setAttribute("class", "btnDiv");
      btnDiv.setAttribute("id", reviewData.data[i].cmtId);
      const btnEdit = document.createElement("button");
      btnEdit.setAttribute("class", "btnedit");
      btnEdit.textContent = "수정";
      const btnDelete = document.createElement("button");
      btnDelete.setAttribute("class", "btndelete");
      btnDelete.textContent = "삭제";

      //수정버튼 이벤트리스너
      btnEdit.addEventListener("click", (e) => {
        e.preventDefault();
        const currentMomDiv = btnEdit.parentElement.parentElement;
        const currenReviewDiv = currentMomDiv.querySelector(".reviewDiv_text");
        const beforeModifyText = currenReviewDiv.innerText;
        editRv(reviewData.ownCmt, beforeModifyText);
      });
      //삭제버튼 이벤트리스너
      btnDelete.addEventListener("click", () =>
        deleteRv(id, reviewData.data[i].cmtId)
      );

      btnDiv.appendChild(btnEdit);
      btnDiv.appendChild(btnDelete);
      momDiv.appendChild(btnDiv);
    }

    grandMomDiv.appendChild(momDiv);
  }
  reviewList.appendChild(grandMomDiv);

  makeBtnSave();
}

//리뷰 작성 완료
function makeBtnSave() {
  content_bntBox.innerHTML = `
  <button class="btnSave">저장</button>
  `;
  const btnSave = document.querySelector(".btnSave");

  btnSave.addEventListener("click", async (e) => {
    e.preventDefault();
    const review = text.value;
    // 5글자 이상 글자 수 검사
    if (review.length < 5) {
      return alert("리뷰를 5글자 이상 작성해주세요");
    }
    // 검사를 통과했으면 요청 보냄
    const res = await Api.post("/api/comments", {
      text: review,
      itemId: localStorage.getItem("itemDetail"),
    });
    // 작성 후 다시 렌더링
    showReview(localStorage.getItem("itemDetail"));
    text.value = "";

    // save 창 막기
    btnSave.addEventListener("click", async (e) => {
      e.preventDefault();
    });
    return alert(res.msg);
  });
}

// 댓글 삭제
async function deleteRv(itemId, commentId) {
  if (confirm(`댓글을 삭제하시겠습니까?`)) {
    const res = await Api.delete("/api/comments", "", {
      itemId,
      commentId,
    });
    // 이전 데이터 삭제
    reviewList.innerHTML = "";
    showReview(localStorage.getItem("itemDetail"));
    return alert(res.msg);
  } else {
    return false;
  }
}
// 댓글 수정
async function editRv(commentId, beforeText) {
  // 빈 칸에 수정 전 내용 넣기
  text.value = beforeText;
  // 버튼을 수정완료로 변경
  content_bntBox.innerHTML = `
    <button class="content_bntBox_done">수정완료</button>
    `;
  const content_bntBox_done = document.querySelector(".content_bntBox_done");

  content_bntBox_done.addEventListener("click", async () => {
    let fixText = text.value;
    if (fixText.length >= 5) {
      const editReview = await Api.patch("/api/comments", "", {
        fixText,
        commentId,
        id,
      });
      alert("수정이 완료되었습니다");
      showReview(localStorage.getItem("itemDetail"));
    } else {
      return alert("댓글을 5자이상 작성해주세요");
    }
  });
}
