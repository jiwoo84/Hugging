import * as Api from "/api.js";

window.addEventListener("load", getName);

async function getName() {
  const user = await Api.get("/api/users/mypage");
  // 지우님 user 콘솔한번 찍어보시고 어떻게 데이터가 왔는지 확인해보세요!
}
