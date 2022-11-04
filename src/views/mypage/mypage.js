import * as Api from "/api.js";

const welcomeMessage = document.querySelector("#welcome-message");

window.addEventListener("load", getName);

async function getName() {
  const user = await Api.get("/api/users/mypage");
  const username = user.name;

  welcomeMessage.innerText = `${username}님 반갑습니다`;
}

const findOrder = document.getElementById("findOrder");
const find_order = async () => {
  console.log("되냐");
  const list_mom = document.getElementById("list_mom");
  while (list_mom.hasChildNodes()) {
    list_mom.removeChild(list_mom.firstChild);
  }
  const list = await Api.get("/api/orders");
  const data = list.data;
  console.log(data.length === 0);
  if (data.length === 0) {
    console.log("ㅋㅋ");
    list_mom.textContent = "구매한 적이 없어요";
    return;
  }
  for (let i = 0; i < data.length; i++) {
    const list_son = document.createElement("div");
    list_son.innerHTML = `
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSThD05wMOmwEeu3Vbe94JDBhWpHBnB--VXXA&usqp=CAU"
            />
            <div>
              <p>총 ${data[i].상품목록.length}개의 상품</p>
              <span class="total_price">${data[i].총금액} 원 </span><span> | ${list.data[i].주문날짜}</span>
              <p>요청사항 : ${data[i].요청사항}</p>
              <span>주문번호 : ${data[i].주문번호}</span>
              </div>
              <div>
              <p>${data[i].배송상태}</p>
              <button id="${data[i]._id}" onclick="orderCancel(this.id)">주문 취소</button>
            </div>
    `;
    list_mom.appendChild(list_son);
  }
  console.log("끝");
  // list.data[i];
};

findOrder.addEventListener("click", find_order);
