import * as Api from "api.js";

const welcomeMessage = document.querySelector("#welcome-message");
const messageBox__totalPayAmount = document.querySelector(
  ".message-box__totalPayAmount"
);
const messageBox__grade = document.querySelector(".message-box__grade");
const loadCouponModal = document.querySelector("#loadCouponModal");

window.addEventListener("load", getUserdata);

// 환영메세지 넣기
async function getUserdata() {
  const user = await Api.get("/hugging/api/users/mypage");
  if (!user) {
    window.location.reload();
  }

  const coupons = await Api.get("/hugging/api/coupons", `${user.data._id}`);
  const { couponId, createAt, discount, name, owner } = coupons.couponList;
  // console.log(coupons.length);
  // 배열로 받기

  const username = user.name;
  const totalPayAmount = user.data.totalPayAmount;

  // 환영 메세지 넣기
  welcomeMessage.dataset.id = user.data._id;
  welcomeMessage.innerText = `${username}님 반갑습니다!`;

  loadCouponModal.innerHTML = `사용가능 쿠폰 ${coupons.couponList.length}장`;

  // 총구매금액 넣기
  messageBox__totalPayAmount.innerText = `총 구매 금액은 ${totalPayAmount}원 입니다`;

  // 등급 넣기
  const grade = (await Api.get("/hugging/api/users/grades")).level;
  messageBox__grade.innerText = `구매 등급은 ${grade}입니다`;
}

const findOrder = document.getElementById("findOrder");
// 주문조회 클릭시 아래함수 실행
// api 요청후 해당 여러 요소 생성후 데이터 주입,
// 모두 주입후 최상위 div에 append 시킴
const find_order = async () => {
  // list_mom 이 최상위 div, 이 공간이 주문목록이 들어오는곳
  const list_mom = document.getElementById("list_mom");
  list_mom.className = "orderList";
  const clicked_title = document.getElementById("clicked_title");
  const clicked_descript = document.getElementById("clicked_descript");
  clicked_title.textContent = "주문 조회";
  clicked_descript.textContent = "";
  // 아래 반복문은 초기화의 기능. 수정,탈퇴 form 이 나올땐 주문목록은 삭제되어야 함.
  while (list_mom.hasChildNodes()) {
    list_mom.removeChild(list_mom.firstChild);
  }

  // JWT 토큰에 유저권한이 담겨있으므로, 해당 api 로 요청하면 현재 로그인한 유저의 구매목록을 반환함
  const list = await Api.get("/hugging/api/orders");
  // 코드를 조금 간결하게 해보려고 변수에 넣음
  const data = list.data;
  console.log("구매내역", data);
  // 만약 사용자가 구매한적이 없다면 최상위 div의 innerText를 바꾸고 함수종료
  if (data.length === 0) {
    list_mom.textContent = "구매한 적이 없어요";
    return;
  }
  // ----------- 이제부터 요소생성 및 데이터 주입---------
  for (let i = 0; i < data.length; i++) {
    // 하나의 주문목록을 담는 최상위 div
    const list_son = document.createElement("div");
    list_son.className = "list_son";
    // 정보가 담기는 div
    const list_img = document.createElement("img");
    list_img.src = data[i].대표이미지;
    list_img.className = "order_img";
    const list_div_info = document.createElement("div");
    list_div_info.className = "list_div_info";
    // 이미지외 다른 정보를 담는 div 생성
    const list_div_info_div = document.createElement("div");
    list_div_info_div.className = "list_div_info_div";
    const list_items = document.createElement("p");
    const list_span_totalPrice = document.createElement("span");
    const list_deliveryMsg = document.createElement("p");
    const list_orderId = document.createElement("span");
    const DATE = list.data[i].주문날짜;
    list_items.textContent = `${data[i].상품목록[0].상품} 외 ${
      data[i].상품목록.length - 1
    }개`;
    list_span_totalPrice.textContent = `결제 금액 : ${
      data[i].총금액
    } 원 |  ${DATE.slice(0, 10)} | ${DATE.slice(11, 19)}`;
    list_deliveryMsg.textContent = `요청사항 : ${data[i].요청사항}`;
    list_orderId.textContent = `주문번호 : ${data[i].주문번호}`;

    // appendChild 는 넣는 순서가 가장 중요함, 잘 생각해서 넣어야함.
    list_div_info_div.appendChild(list_items);
    list_div_info_div.appendChild(list_span_totalPrice);
    list_div_info_div.appendChild(list_deliveryMsg);
    list_div_info_div.appendChild(list_orderId);
    list_div_info.appendChild(list_img);
    list_div_info.appendChild(list_div_info_div);
    // 주문상태 div
    const list_div_status = document.createElement("div");
    list_div_status.className = "list_div_status";
    const list_div_status_p = document.createElement("p");
    list_div_status_p.textContent = `${data[i].배송상태}`;
    list_div_status.appendChild(list_div_status_p);

    // 주문수정 가능할시 삭제버튼 추가
    if (data[i].수정 === "수정가능") {
      const delBtn = document.createElement("button");
      delBtn.id = "delBtn";
      delBtn.className = "button";
      delBtn.textContent = "주문취소";
      delBtn.addEventListener("click", async () => {
        const body = { id: data[i].주문번호, reson: "고객취소" };
        // 취소 api 요청
        const a = await Api.patch("/hugging/api/orders", "", body);
        // 취소함수는  다시 부모 함수를 실행하여 reload 없이 갱신한다.
        find_order();
        alert("주문이 취소되었습니다.");
      });
      list_div_status.appendChild(delBtn);
    }
    //주문데이터가 주입된 요소를 주문내역 최상위 div에 주입
    list_son.appendChild(list_div_info);
    list_son.appendChild(list_div_status);
    // 주문내역 최상위 div를 주문내역 공간에 주입
    list_mom.appendChild(list_son);
  }
  return;
};

findOrder.addEventListener("click", find_order);
