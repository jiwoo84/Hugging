import * as Api from "/api.js";

const searchSubmit= document.querySelector(".search__submit");
const searchResult = document.querySelector(".search__result");

searchSubmit.addEventListener("click",async(e)=>{
    const searchWord = document.querySelector(".search__text");
    console.log(searchWord.value);
    const {data} =  await Api.get("/api/items",`search?word=${searchWord.value}`);
    data.forEach( item =>{
        const product =  document.createElement("div");
        product.innerHTML = `
        <div id = "${item._id}" class = "card">
            <img src="${item.imageUrl}" class ="productImg">
            <div class="productInfo">
                <p class="name">${item.name}</p>
                <p class="category">${item.category}</p>
                <p class="price">${item.price}</p>
            </div>
        </div>`;
        searchResult.appendChild(product);
        moveTodetailBtn(item._id);

    });
});

// 상품의 이미지 클릭하면 상세페이지로 이동
function moveTodetailBtn(key){
    const container = document.getElementById(`${key}`);
    const imgTag = container.querySelector(".productImg");
    imgTag.addEventListener("click", ()=>{
        localStorage.setItem("itemDetail",key);
        location.href = "/detail";
    });
}