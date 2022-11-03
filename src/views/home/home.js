import * as Api from "/api.js";
// import { randomId } from "/useful-functions.js";

const bestContainer= document.querySelector(".bestContainer");
const newContainer = document.querySelector(".newContainer");

getDataFromApi();

addAllElements();
addAllEvents();


// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertTextToLanding();
  insertTextToGreeting();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  landingDiv.addEventListener("click", alertLandingText);
  greetingDiv.addEventListener("click", alertGreetingText);
}

function insertTextToLanding() {
  landingDiv.insertAdjacentHTML(
    "beforeend",
    `
      <h2>n팀 쇼핑몰의 랜딩 페이지입니다. 자바스크립트 파일에서 삽입되었습니다.</h2>
    `
  );
}

function insertTextToGreeting() {
  greetingDiv.insertAdjacentHTML(
    "beforeend",
    `
      <h1>반갑습니다! 자바스크립트 파일에서 삽입되었습니다.</h1>
    `
  );
}

function alertLandingText() {
  alert("n팀 쇼핑몰입니다. 안녕하세요.");
}

function alertGreetingText() {
  alert("n팀 쇼핑몰에 오신 것을 환영합니다");
}

async function getDataFromApi() {

  const data = await Api.get("/api/items");
  // data = [ [{...},{...}...{...}:8개] , [{...}{}{}:3개] ]
  const {bestItems, newItems} = data;

  
  bestContainer.appendChild(draw(bestItems,"bestItem"));
  attachBtn(className);
  newContainer.appendChild(draw(newItems,"newItem"));
}

function draw(Items,className){
  let card = document.createElement ('div')
  for(let i =0; i<Items.length;i++){
    card.innerHTML +=`
    <div id="${Items[i]._id}" class="${className}">
      <p>${Items[i].name}</p>
      <img src="${Items[i].imageUrl}">
      <p>${Items[i].price}</p>
      <p>${Items[i].category}</p>
    </div>
    `;
  }
  return card;
}

function createDB(){
  if (window.indexedDB) {
    const databaseName = "cart";
    const version = 1;

    const request = indexedDB.open(databaseName, version);

    request.onupgradeneeded = function () {
      request.result.createObjectStore("items", { autoIncrement: true });
    };
    request.onsuccess = function () {};
    request.onerror = function (event) { alert(event.target.errorCode);}
  }
}

function attachBtn(className){
  const detailToBtns = document.querySelectorAll(`.${className}`);
  console.log(detailToBtns);

  detailToBtns.forEach( (detailToBtn)=>{
    detailToBtn.addEventListener("click",()=>{
      const id = detailToBtn.id;
      localStorage.setItem('itemDetail',`${id}`);
      location.href = "/detail";
    })
  });
}

