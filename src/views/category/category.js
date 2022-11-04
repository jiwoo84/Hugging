import * as Api from "../api.js";

async function 전체카테고리() {
  const allCategories = await Api.get("/api/ctegories/all");
  console.log(allCategories);
}
전체카테고리();
// createDB();
// getDataFromApi();

// async function getDataFromApi() {
//   const data = await Api.get("/categories/all");
//   // data = [ [{...},{...}...{...}:8개] , [{...}{}{}:3개] ]
//   const { bestItems, newItems } = data;

//   bestContainer.appendChild(draw(bestItems, "bestItem"));
//   newContainer.appendChild(draw(newItems, "newItem"));

//   attachBtn();
// }

// function draw(Items, className) {
//   let card = document.createElement("div");
//   card.setAttribute("class", "containerLayout");
//   for (let i = 0; i < Items.length; i++) {
//     card.innerHTML += `
//     <div id="${Items[i]._id}" class="${className}">
//       <p>${Items[i].name}</p>
//       <img src="${Items[i].imageUrl}">
//       <p>${Items[i].price}</p>
//       <p>${Items[i].category}</p>
//     </div>
//     `;
//   }
//   return card;
// }

// function createDB() {
//   if (window.indexedDB) {
//     const databaseName = "cart";
//     const version = 1;

//     const request = indexedDB.open(databaseName, version);

//     request.onupgradeneeded = function () {
//       request.result.createObjectStore("items", { keyPath: "id" });
//     };
//     request.onsuccess = function () {};
//     request.onerror = function (event) {
//       alert(event.target.errorCode);
//     };
//   }
// }
