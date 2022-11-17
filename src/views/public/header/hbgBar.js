import * as Api from "../../api.js";

const categoryMom = document.querySelector("#categoryMom");
const categoryUserInfo__welcomeMsg = document.querySelector(
  "#categoryUserInfo__welcomeMsg"
);
const categoryUserInfo__grade = document.querySelector(
  "#categoryUserInfo__grade"
);

// 로그인시에만 상단 사용자정보 불러옴
if (localStorage.getItem("loggedIn") === "true") {
  ShowUserInfo();
}
ShowNavBar();

//상단 사용자 정보 랜더링
async function ShowUserInfo() {
  try {
    //유저 이름 받아오기
    const username = (await Api.get("/api/users/mypage")).data.name;
    categoryUserInfo__welcomeMsg.innerText = `${username}님 반갑습니다`;
    // 등급 받아오기
    const grade = (await Api.get("/api/users/grades")).level;
    console.log(grade);
    categoryUserInfo__grade.innerText = `회원님의 등급은 ${grade}입니다`;
  } catch {
    // 관리자라면 name 받아올 수 없으니 에러처리
    categoryUserInfo__welcomeMsg.innerText = `관리자님 반갑습니다`;
  }
}

//카테고리리스트 햄버거바에 렌더링
async function ShowNavBar() {
  const data = await Api.get("/api/categories/all");

  for (let i = 0; i < data.data.length; i++) {
    const navName = data.data[i].name;
    const navIdx = data.data[i].index;
    const categoryDiv = document.createElement("li");
    categoryDiv.setAttribute("class", "navbar-item");
    categoryDiv.id = navName;
    categoryDiv.dataset.index = navIdx;
    categoryDiv.textContent = navName;
    categoryMom.appendChild(categoryDiv);

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
