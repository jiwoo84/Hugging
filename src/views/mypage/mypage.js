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
    // 최상위 div
    const list_son = document.createElement("div");
    list_son.className = "list_son";
    // 정보가 담기는 div
    const list_img = document.createElement("img");
    list_img.src = data[i].대표이미지;
    list_img.className = "order_img";
    const list_div_info = document.createElement("div");
    list_div_info.className = "list_div_info";
    const list_div_info_div = document.createElement("div");
    list_div_info_div.className = "list_div_info_div";
    const list_items = document.createElement("p");
    const list_span_totalPrice = document.createElement("span");
    const list_deliveryMsg = document.createElement("p");
    const list_orderId = document.createElement("span");
    list_items.textContent = `${data[i].상품목록[0].상품}외 ${data[i].상품목록.length}개`;
    list_span_totalPrice.textContent = `결제 금액 : ${data[i].총금액} 원 |  ${list.data[i].주문날짜}`;
    list_deliveryMsg.textContent = `요청사항 : ${data[i].요청사항}`;
    list_orderId.textContent = `주문번호 : ${data[i].주문번호}`;
    list_div_info_div.appendChild(list_items);
    list_div_info_div.appendChild(list_span_totalPrice);
    list_div_info_div.appendChild(list_deliveryMsg);
    list_div_info_div.appendChild(list_orderId);
    list_div_info.appendChild(list_img);
    list_div_info.appendChild(list_div_info_div);
    // 주문상태
    const list_div_status = document.createElement("div");
    list_div_status.className = "list_div_status";
    const list_div_status_p = document.createElement("p");
    list_div_status_p.textContent = `${data[i].배송상태}`;
    list_div_status.appendChild(list_div_status_p);

    // 주문수정 가능할시 삭제버튼 추가
    if (data[i].수정 === "수정가능") {
      const delBtn = document.createElement("button");
      delBtn.id = data[i]._id;
      delBtn.textContent = "주문취소";
      delBtn.addEventListener("click", async () => {
        const body = { id: data[i].주문번호, reson: "고객취소" };
        const a = await Api.patch("/api/orders", "", body);
        find_order();
        alert("주문이 취소되었습니다.");
      });
      list_div_status.appendChild(delBtn);
    }
    list_son.appendChild(list_div_info);
    list_son.appendChild(list_div_status);
    list_mom.appendChild(list_son);
  }
  console.log("끝");
  // list.data[i];
};

function orderCancel(id) {
  console.log(id);
}
findOrder.addEventListener("click", find_order);
