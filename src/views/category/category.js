import * as Api from "../api.js";

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
  // const homeproducts = data.data[0].name;
  // const homeproducts1 = data.data[0].index;
  // const officeproducts = data.data[1].name;
  // const officeproducts1 = data.data[1].index;
  // const itemsFromCategory = await Api.get(
  //   `/api/categories?name=${homeproducts}&index=${homeproducts1}`
  // );
  // console.log(itemsFromCategory);
  // postItems.innerHTML = `<div class="showItem">
  // </div>`;

  for (let i = 0; i < data.data.length; i++) {
    const navName = data.data[i].name;
    navigationBar.innerHTML += `<div class="${navName}">${navName}<div>`;
    // showItem.innerHTML += `<div class="${showItem}">${showItem}<div>`;
  }
}
// const showItem = document.querySelector(".showItem");

ShowNavBar();

async function 아이템보여줘() {
  const items = await Api.get(`/api/categories?name=%ED%99%88&index=400`);
  console.log(items);
}
아이템보여줘();
// for (let i = 0; i < data.data.length; i++) {
//   const navName = data.data[i].name;
//   itemBox.innerHTML += `<div class="${navName}">${navName}<div>`;
// }
