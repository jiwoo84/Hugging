import * as Api from "api.js";
import { addCommas } from "useful-functions.js";

const navigationBar = document.querySelector("#navbarList");
const postItems = document.querySelector(".postItems");
const pageHtml = document.querySelector("#pageHtml");
let totalData;
let Currentpage = 1;

showItemFromSidebar();
ShowNavBar();

// sidebar에서 특정 카테고리 이름 클릭 시 특정 카테고리 렌더링
async function showItemFromSidebar() {
  const name = localStorage.getItem("catetoryName");
  const index = localStorage.getItem("catetoryIndex");
  //아이템 렌더링
  showFuction(name, index);
}

//카테고리리스트 화면에 렌더링
async function ShowNavBar() {
  const data = await Api.get("/hugging/api/categories/all");

  for (let i = 0; i < data.data.length; i++) {
    const navName = data.data[i].name;
    const navIdx = data.data[i].index;
    const categoryDiv = document.createElement("div");

    categoryDiv.setAttribute("class", "navbar-Item");
    categoryDiv.id = navName;
    categoryDiv.innerHTML = navName;
    navigationBar.appendChild(categoryDiv);
    //div 만들고 이벤트리스너 만들기
    categoryDiv.addEventListener("click", () => {
      showFuction(navName, navIdx);
    });
  }
}

function paging(page, perPage, totalPage, totalData) {
  //페이징에 나타낼 페이지 수
  let pageCount = 3;

  // 총 페이지수가 페이징에 나타낼 페이지 수 보다 작다면
  // 페이지에 나타낼 페이지 수는 총 페이지수와 같다.
  if (totalPage < pageCount) {
    pageCount = totalPage;
  }

  // 페이지 그룹
  let pageGroup = Math.ceil(page / pageCount);

  // 화면에 보여질 마지막 페이지 번호
  let last = pageGroup * pageCount;

  // 총 페이지수가 마지막으로 보여줄 페이지넘버보다 작다면
  // 마지막페이지 넘버를 총페이지수로 할당
  if (last > totalPage) {
    last = totalPage;
  }

  //첫번째 페이지 번호
  let first = last - (pageCount - 1);

  let next = last + 1;
  let prev = first - 1;

  //이전버튼
  if (prev > 0) {
    pageHtml.innerHTML += `<li><a href="#" id="prev"> 이전 </a></li>`;
  }

  //페이징 번호 표시
  for (let i = first; i <= last; i++) {
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
  }

  //페이징 번호 클릭 이벤트
  pageHtml.querySelectorAll("li a").forEach((li) => {
    li.addEventListener("click", async function () {
      while (postItems.hasChildNodes()) {
        postItems.removeChild(postItems.firstChild);
      }
      while (pageHtml.hasChildNodes()) {
        pageHtml.removeChild(pageHtml.firstChild);
      }

      if (li.id === "next") {
        Currentpage = next;
      } else if (li.id === "prev") {
        Currentpage = prev;
      } else {
        Currentpage = Number(li.id);
      }
      //페이징 표시 재호출
      paging(Currentpage, perPage, totalPage);
      //글 목록 표시 재호출
      displayData(Currentpage, perPage);
    });
  });
}

function displayData(page, perPage) {
  let len = totalData.length;
  if (len < perPage) {
    perPage = len;
  }
  for (
    let i = (page - 1) * perPage;
    i <
    (len < (page - 1) * perPage + perPage
      ? len
      : (page - 1) * perPage + perPage);
    i++
  ) {
    // item 렌더링
    // 큰 div
    const momDiv = document.createElement("div");
    momDiv.setAttribute("class", "momDiv");
    momDiv.setAttribute("id", totalData[i]._id);
    //작은 div(이미지+이름),
    const sonDiv = document.createElement("div");
    sonDiv.setAttribute("class", "sonDiv");
    const imgBox = document.createElement("div");
    imgBox.setAttribute("class", "imgBox");
    const img = document.createElement("img");
    img.id = "imgId";
    img.src = totalData[i].imageUrl;
    img.alt = totalData[i].name;
    const nameDiv = document.createElement("div");
    nameDiv.setAttribute("class", "nameDiv");
    nameDiv.textContent = totalData[i].name;
    //가격|카테고리이름 div
    const detailDiv = document.createElement("div");
    detailDiv.setAttribute("id", "detail-div");
    const priceDiv = document.createElement("div");
    priceDiv.setAttribute("class", "priceDiv");
    priceDiv.textContent = addCommas(totalData[i].price) + "원";
    const stick = document.createElement("h4");
    stick.textContent = "|";
    const detailCategory = document.createElement("div");
    detailCategory.setAttribute("class", "detailCategory");
    detailCategory.textContent = totalData[i].category;

    detailDiv.appendChild(priceDiv);
    detailDiv.appendChild(stick);
    detailDiv.appendChild(detailCategory);
    imgBox.appendChild(img);
    sonDiv.appendChild(imgBox);
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
  while (pageHtml.hasChildNodes()) {
    pageHtml.removeChild(pageHtml.firstChild);
  }
  Currentpage = 1;
  const categoryItem = await Api.get(
    `/api`,
    `categories?name=${카테고리이름}&index=${인덱스} &page=${Currentpage}&perPage=9`
  );
  //data는 각 카테고리의 전체 목록리스트
  const { page, perPage, totalPage } = categoryItem;
  totalData = categoryItem.data;

  displayData(page, perPage, totalData);
  paging(page, perPage, totalPage, totalData);
}
