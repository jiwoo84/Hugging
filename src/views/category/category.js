import * as Api from "../api.js";

//띄어쓰기, 포문 왜 돌아가는지, 이유 적어서 숙제!!!

const navigationBar = document.querySelector(".navigation");
const postItems = document.querySelector(".postItems");

//모든카테고리 콘솔창에 보여줘
async function AllCategoryList() {
  const allCategories = await Api.get("/api/categories/all");
  console.log(allCategories);
}
AllCategoryList();

////모든카테고리 보여줘
async function ShowNavBar() {
  const data = await Api.get("/api/categories/all");

  for (let i = 0; i < data.data.length; i++) {
    const navName = data.data[i].name;
    const navIdx = data.data[i].index;
    const categoryDiv = document.createElement("div");
    categoryDiv.id = navName;
    categoryDiv.textContent = navName;
    navigationBar.appendChild(categoryDiv);
    categoryDiv.addEventListener("click", () => {
      showFuction(navName, navIdx);
    });
  }
}

ShowNavBar();

//데이터 잘 오니?
async function showItems() {
  let 카테고리이름 = "홈";
  let 인덱스 = 400;
  const items = await Api.get(
    `/api/categories?name=${카테고리이름}&index=${인덱스}`
  );
  console.log(items);
}

//카테고리 값 클릭 시 아이템 렌더링

async function showFuction(카테고리이름, 인덱스) {
  // 이전 데이터 삭제
  while (postItems.hasChildNodes()) {
    postItems.removeChild(postItems.firstChild);
  }
  const categoryItem = await Api.get(
    `/api/categories?name=${카테고리이름}&index=${인덱스}`
  );
  for (let i = 0; i < categoryItem.data.length; i++) {
    //큰 엄마 디브 만들기
    const momDiv = document.createElement("div");
    const img = document.createElement("img");
    img.src = categoryItem.data[i].imageUrl;
    const nameDiv = document.createElement("div");
    nameDiv.textContent = categoryItem.data[i].name;
    const priceDiv = document.createElement("div");
    priceDiv.textContent = categoryItem.data[i].price;

    momDiv.appendChild(img);
    momDiv.appendChild(nameDiv);
    momDiv.appendChild(priceDiv);
    postItems.appendChild(momDiv);
  }
}
