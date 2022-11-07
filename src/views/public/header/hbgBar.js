import * as Api from "../../api.js";

AllCategoryList();
ShowNavBar();

const categoryMom = document.querySelector("#categoryMom");

//카테고리리스트 콘솔창에 출력
async function AllCategoryList() {
  const allCategories = await Api.get("/api/categories/all");
  console.log(allCategories);
}

//카테고리리스트 햄버거바에 렌더링
async function ShowNavBar() {
  const data = await Api.get("/api/categories/all");
  console.log("category");

  for (let i = 0; i < data.data.length; i++) {
    const navName = data.data[i].name;
    const navIdx = data.data[i].index;
    const categoryDiv = document.createElement("li");
    categoryDiv.setAttribute("class", "navbar-item");
    categoryDiv.id = navName;
    categoryDiv.dataset.index = navIdx;
    categoryDiv.textContent = navName;
    categoryMom.appendChild(categoryDiv);
    console.log();
    //클릭 시 로컬 스토리지에 저장
    categoryDiv.addEventListener("click", () => {
      const id = categoryDiv.id;
      const index = categoryDiv.dataset.index;
      console.log("catetoryName : " + localStorage.getItem("catetoryName"));
      console.log("catetoryIndex : " + localStorage.getItem("catetoryIndex "));
      localStorage.setItem("catetoryName", id);
      localStorage.setItem("catetoryIndex", index);
      location.href = "/category";
    });
  }
}
