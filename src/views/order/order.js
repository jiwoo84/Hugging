import * as Api from "/api.js";

// 요소(element), input 혹은 상수
getDataFromApi();

async function getDataFromApi() {
    const user = await Api.get("/api/users","mypage");

    console.log(user.data);
    //이름, 전화번호, 주소
}
