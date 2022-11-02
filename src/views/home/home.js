// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.

import * as Api from "/api.js";
// import { randomId } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const bestContainer= document.querySelector(".bestContainer");
const newContainer = document.querySelector(".newContainer");

getDataFromApi();
createDB();

async function getDataFromApi() {
  // 예시 URI입니다. 현재 주어진 프로젝트 코드에는 없는 URI입니다.

  const data = await Api.get("/api/items");
  // data = [ [{...},{...}...{...}:8개] , [{...}{}{}:3개] ]
  const {bestItems, newItems} = data;

  //bestitem
  for(let i =0; i<6;i++){
    let card = document.createElement ('div')
    card.innerHTML =`
    <div id="${bestItems[i]._id}" onclick="move(this.id)">
      <p>${bestItems[i].name}</p>
      <img src="${bestItems[i].imageUrl}">
      <p>${bestItems[i].price}</p>
      <p>${bestItems[i].category}</p>
    </div>
    `;
    bestContainer.appendChild(card);
  }

  //newItem
  for(let i =0; i<newItems.length;i++){
    let card = document.createElement ('div')
    let name = document.createElement ('p')
    let img = document.createElement ('img')
    let price = document.createElement ('p')
    let category = document.createElement ('p')
    
    name.innerHTML = newItems[i].name;
    img.setAttribute('src', newItems[i].imageUrl);
    price.innerHTML = newItems[i].price;
    category.innerHTML = newItems[i].category;
    
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(price);
    card.appendChild(category);
    newContainer.appendChild(card);
  }
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