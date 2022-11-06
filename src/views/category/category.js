import * as Api from "../api.js";

showItemFromSidebar();

// sidebar에서 특정 카테고리 이름 클릭 시 특정 카테고리 렌더링
async function showItemFromSidebar() {
  console.log("catetoryName : " + localStorage.getItem("catetoryName"));
  const res = await Api.get(
    "/api/category",
    `${localStorage.getItem("catetoryName")}`
  );
}

const navigationBar = document.querySelector(".navbar-start");
const postItems = document.querySelector(".postItems");

//카테고리리스트 콘솔창에 출력
async function AllCategoryList() {
  const allCategories = await Api.get("/api/categories/all");
  console.log(allCategories);
}
AllCategoryList();

//카테고리리스트 화면에 렌더링
async function ShowNavBar() {
  const data = await Api.get("/api/categories/all");

  for (let i = 0; i < data.data.length; i++) {
    const navName = data.data[i].name;
    const navIdx = data.data[i].index;
    const categoryDiv = document.createElement("a");
    categoryDiv.setAttribute("class", "navbar-item");
    categoryDiv.id = navName;
    categoryDiv.textContent = navName;
    navigationBar.appendChild(categoryDiv);
    //div 만들고 이벤트리스너 만들기
    categoryDiv.addEventListener("click", () => {
      showFuction(navName, navIdx);
    });
  }
}

ShowNavBar();

//특정 카테고리 값이 잘오는지 콘솔창 출력
async function showItems() {
  let 카테고리이름 = "홈";
  let 인덱스 = 400;
  const items = await Api.get(
    `/api/categories?name=${카테고리이름}&index=${인덱스}`
  );
  console.log(items);
}

//특정 카테고리 값 클릭 시 아이템들 렌더링 함수
async function showFuction(카테고리이름, 인덱스) {
  // 이전 데이터 삭제(안하면 이전 데이터가 계속 쌓임)
  while (postItems.hasChildNodes()) {
    postItems.removeChild(postItems.firstChild);
  }
  const categoryItem = await Api.get(
    `/api/categories?name=${카테고리이름}&index=${인덱스}`
  );
  for (let i = 0; i < categoryItem.data.length; i++) {
    //큰 디브 이후, 이미지, 네임디브, 가격디브 만들고 추가
    const momDiv = document.createElement("div");
    momDiv.class = "momDiv";
    momDiv.id = categoryItem.data[i]._id;
    const img = document.createElement("img");
    img.id = "imgId";
    img.src = categoryItem.data[i].imageUrl;
    img.alt = categoryItem.data[i].name;
    const nameDiv = document.createElement("div");
    nameDiv.textContent = categoryItem.data[i].name;
    const priceDiv = document.createElement("div");
    priceDiv.textContent = categoryItem.data[i].price;

    momDiv.appendChild(img);
    momDiv.appendChild(nameDiv);
    momDiv.appendChild(priceDiv);
    postItems.appendChild(momDiv);

    momDiv.addEventListener("click", () => {
      const id = momDiv.id;
      localStorage.setItem("itemDetail", `${id}`);
      location.href = "/detail";
    });
  }
}
