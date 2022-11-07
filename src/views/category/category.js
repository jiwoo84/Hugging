import * as Api from "../api.js";

const navigationBar = document.querySelector(".navbar-start");
const postItems = document.querySelector(".postItems");

showItemFromSidebar();
AllCategoryList();
ShowNavBar();

// sidebar에서 특정 카테고리 이름 클릭 시 특정 카테고리 렌더링
async function showItemFromSidebar() {
  const name = localStorage.getItem("catetoryName");
  const index = localStorage.getItem("catetoryIndex");
  console.log("catetoryName : " + localStorage.getItem("catetoryName"));
  //아이템 렌더링
  showFuction(name, index);
}

//카테고리리스트 콘솔창에 출력
async function AllCategoryList() {
  const allCategories = await Api.get("/api/categories/all");
  console.log(allCategories);
}

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
    momDiv.setAttribute("class", "momDiv");
    momDiv.id = categoryItem.data[i]._id;
    const sonDiv = document.createElement("div");
    sonDiv.setAttribute("class", "sonDiv");
    const img = document.createElement("img");
    img.id = "imgId";
    img.src = categoryItem.data[i].imageUrl;
    img.alt = categoryItem.data[i].name;
    const nameDiv = document.createElement("div");
    nameDiv.setAttribute("class", "nameDiv");
    // nameDiv.class = "itemName";
    nameDiv.textContent = categoryItem.data[i].name;
    const priceDiv = document.createElement("div");
    priceDiv.setAttribute("class", "priceDiv");
    priceDiv.textContent = categoryItem.data[i].price;
    const priceDiv = document.createElement("div");

    sonDiv.appendChild(img);
    sonDiv.appendChild(nameDiv);
    sonDiv.appendChild(priceDiv);
    momDiv.appendChild(sonDiv);
    postItems.appendChild(momDiv);

    momDiv.addEventListener("click", () => {
      const id = momDiv.id;
      localStorage.setItem("itemDetail", `${id}`);
      location.href = "/detail";
    });
  }
}
