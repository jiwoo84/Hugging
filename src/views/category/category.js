import * as Api from "../api.js";

const navigationBar = document.querySelector(".navbar-start");
const postItems = document.querySelector(".postItems");
const pageHtml = document.querySelector("#pageHtml");

showItemFromSidebar();
ShowNavBar();

// sidebar에서 특정 카테고리 이름 클릭 시 특정 카테고리 렌더링
async function showItemFromSidebar() {
  const name = localStorage.getItem("catetoryName");
  const index = localStorage.getItem("catetoryIndex");
  console.log("catetoryName : " + localStorage.getItem("catetoryName"));
  //아이템 렌더링
  showFuction(name, index);
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

function paging(page,perPage,totalPage){
  //page = 1이라고 하자. 현재페이지
  //totalPage = 10이라고 하자

  //페이징에 나타낼 페이지 수
  let pageCount = 5; 

  // 총 페이지수가 페이징에 나타낼 페이지 수 보다 작다면
  // 페이지에 나타낼 페이지 수는 총 페이지수와 같다.
  // ex 총페이지수 : 5, 페이지에 나타낼 페이지수 : 10  => 1 ~ 5
  // ex 총페이지수 : 10, 페이지에 나타낼 페이지수 : 5  => 1 ~ 5, 6 ~ 10
  if (totalPage < pageCount){
    pageCount = totalPage;
  }

  // 1 ~ 5
  // 페이지 그룹
  // 현재 페이지 1이라면 1/5의 올림은 = 1(1번그룹)
  // 6 ~10 page = 2번그룹
  let pageGroup = Math.ceil( page / pageCount);

  // 화면에 보여질 마지막 페이지 번호
  // 1 * 5 = 5 (1번그룸)
  // 2 * 5 = 10 (2번그룸)
  let last = pageGroup * pageCount; 

  // 총 페이지수가 마지막으로 보여줄 페이지넘버보다 작다면
  // 마지막페이지 넘버를 총페이지수로 할당
  if( last > totalPage){
    last = totalPage;
  }

  //첫번째 페이지 번호
  // first = 5 -(5-1) = 1 (1번그룹)
  //       = 10 -(5-1) = 6 (2번그룹)
  let first = last - (pageCount-1);
  let next = last + 1;
  let prev = first - 1;

  //이전버튼
  if (prev > 0) {
    pageHtml.innerHTML += `<li><a href="#" id="prev"> 이전 </a></li>`;
    //페이징번호 클릭 이벤트
    const prevBtn = pageHtml.querySelector("#prev");
    prevBtn.addEventListener("click",()=>{
      //페이징 표시 재호출
      page = prev;
      console.log(page);
      paging(page,totalPage);
      //아이템 목록 표시 재호출
      displayData(page, perPage);
    });
  }


  //페이징 번호 표시
  for (var i = first; i <= last; i++) {
    if (page == i) {
      pageHtml.innerHTML +=
        "<li class='on'><a href='#' id='" + i + "'>" + i + "</a></li>";
    } else {
      pageHtml.innerHTML += "<li><a href='#' id='" + i + "'>" + i + "</a></li>";
    }
  }

  //이후버튼
  if (last < totalPage) {
    pageHtml.innerHTML += `<li><a href="#" id="next"> 다음 </a></li>`;
    //페이징번호 클릭 이벤트
    const nextBtn = pageHtml.querySelector("#prev");
    nextBtn.addEventListener("click",()=>{
      //페이징 표시 재호출
      page = next;
      console.log(page);
      paging(page,totalPage);
      //아이템 목록 표시 재호출
      displayData(page, perPage);
    });
  }
}


function displayData(page,perPage,data){

  if( data.length <perPage){
    perPage= data.length;
  }

  for (let i = (page-1)*perPage; i < (page-1)* perPage + perPage; i++) {
    // item 렌더링
    // 큰 div
    const momDiv = document.createElement("div");
    momDiv.setAttribute("class", "momDiv");
    momDiv.setAttribute("id",data[i]._id) ;
    //작은 div(이미지+이름),
    const sonDiv = document.createElement("div");
    sonDiv.setAttribute("class", "sonDiv");
    const img = document.createElement("img");
    img.id = "imgId";
    img.src = data[i].imageUrl;
    img.alt = data[i].name;
    const nameDiv = document.createElement("div");
    nameDiv.setAttribute("class", "nameDiv");
    nameDiv.textContent = data[i].name;
    //가격|카테고리이름 div
    const detailDiv = document.createElement("div");
    detailDiv.setAttribute("class", "detailDiv");
    const priceDiv = document.createElement("div");
    priceDiv.setAttribute("class", "priceDiv");
    priceDiv.textContent =data[i].price;
    const stick = document.createElement("h4");
    stick.textContent = "|";
    const detailCategory = document.createElement("div");
    detailCategory.setAttribute("class", "detailCategory");
    detailCategory.textContent = data[i].category;

    detailDiv.appendChild(priceDiv);
    detailDiv.appendChild(stick);
    detailDiv.appendChild(detailCategory);
    sonDiv.appendChild(img);
    sonDiv.appendChild(nameDiv);
    sonDiv.appendChild(detailDiv);
    momDiv.appendChild(sonDiv);
    postItems.appendChild(momDiv);

    momDiv.addEventListener("click", () => {
      const id = momDiv.id;
      localStorage.setItem("itemDetail", `${id}`);
      location.href = "/detail";
    });
  }
}

//특정 카테고리 값 클릭 시 아이템들 렌더링 함수
async function showFuction(카테고리이름, 인덱스) {
  // 이전 데이터 삭제(안하면 이전 데이터가 계속 쌓임)
  while (postItems.hasChildNodes()) {
    postItems.removeChild(postItems.firstChild);
  }
  const categoryItem = await Api.get(
    `/api`,`categories?name=${카테고리이름}&index=${인덱스} &page=1&perPage=9`
  );
  //data는 각 카테고리의 전체 목록리스트
  console.log(categoryItem);
  const {data,page,perPage,totalPage} = categoryItem;
  
  displayData(page,perPage,data);
  paging(page,perPage,totalPage);
}
