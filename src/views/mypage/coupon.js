import * as Api from "/api.js";


const modal = async () => {
    const user = await Api.get("/api/users/mypage");
    if (!user) {
        window.location.reload();
    }
    const coupons = await Api.get("/api/coupons",`${user.data._id}`);
    const couponList = coupons.couponList;
    console.log(couponList);
    while (list_mom.hasChildNodes()) {
        list_mom.removeChild(list_mom.firstChild);
    }

    const form = document.createElement("div");
    form.id = "coupon_div";
    form.innerHTML="";
    if (couponList.length <1){form.innerHTML += '사용가능한 쿠폰이 없습니다.';}
    else{
        form.innerHTML = `<small>사용가능한 쿠폰입니다.</small>`;
        couponList.forEach( coupon => {
            const {couponId,createdAt,discount,name,owner} = coupon;
            form.innerHTML += `${name}  ${discount}%할인  ${createdAt}까지 사용가능`;
        });
    }

    console.log(form);
    list_mom.appendChild(form);
};

document.getElementById("loadCouponModal").addEventListener("click", modal);
