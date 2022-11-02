import * as Api from "/api.js";

const welcomeMessage = document.querySelector("#welcome-message");

window.addEventListener("load", getName);

async function getName() {
  const user = await Api.get("/api/users/mypage");
  const { username } = user.name;

  welcomeMessage.innerText = `${username}님 반갑습니다`;
}
