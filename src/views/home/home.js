import * as Api from "..api";
import { addCommas } from "useful-functions.js";

const bestContainer = document.querySelector(".bestContainer");
const newContainer = document.querySelector(".newContainer");
const splashImg = document.querySelector(".splashImg");
const splashContainer = document.querySelector(".splashContainer");

createDB();
getDataFromApi();

async function getDataFromApi() {
  const data = await Api.get("/hugging/api/items");
  // 베스트와 신상품 데이터 get
  const { bestItems, newItems } = data;

  bestContainer.appendChild(createCard(bestItems, "bestItem"));
  newContainer.appendChild(createCard(newItems, "newItem"));

  attachBtn();
}
// renderging
function createCard(Items, className) {
  const card = document.createElement("div");
  card.setAttribute("class", "containerLayout");
  for (let i = 0; i < Items.length; i++) {
    card.innerHTML += `
    <div id="${Items[i]._id}" class="${className}">
      <div class="imgBox">
        <img src="${Items[i].imageUrl}">
      </div>
      <h3>${Items[i].name}</h3>
      <div>
        <p>${addCommas(Items[i].price)} 원 </p>
        <h4> | </h4>
        <small>  ${Items[i].category}</small>
      </div>
    </div>
    `;
  }
  return card;
}

//indexedDB 생성
function createDB() {
  if (window.indexedDB) {
    const databaseName = "cart";
    const version = 1;

    const request = indexedDB.open(databaseName, version);

    request.onupgradeneeded = function () {
      request.result.createObjectStore("items", { keyPath: "id" });
      request.result.createObjectStore("nowBuy", { keyPath: "id" });
    };
    request.onsuccess = function () {};
    request.onerror = function (event) {
      alert(event.target.errorCode);
    };
  }
}

function attachBtn() {
  const detailToBtns = document.querySelectorAll(".bestItem");
  const newItemToBtns = document.querySelectorAll(".newItem");

  detailToBtns.forEach((detailToBtn) => {
    detailToBtn.addEventListener("click", () => {
      const id = detailToBtn.id;
      localStorage.setItem("itemDetail", `${id}`);
      location.href = "/detail";
    });
  });

  newItemToBtns.forEach((newItemToBtn) => {
    newItemToBtn.addEventListener("click", () => {
      const id = newItemToBtn.id;
      localStorage.setItem("itemDetail", `${id}`);
      location.href = "/detail";
    });
  });
}
//스플래시 이미지
window.onload = function enterCheck() {
  if (sessionStorage.getItem("enterIn") !== "show") {
    const splashImg = document.createElement("img");
    splashImg.setAttribute("src", "../public/img/splashImg.jpg");
    splashImg.setAttribute("class", "splashImg");
    splashContainer.appendChild(splashImg);
    sessionStorage.setItem("enterIn", "show");
    setTimeout(() => {
      splashContainer.removeChild(splashImg);
    }, 1500);
    return;
  }
};
