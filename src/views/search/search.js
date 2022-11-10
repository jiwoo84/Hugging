import * as Api from "/api.js";

const searchSubmit= document.querySelector(".search__submit");
const searchResult = document.querySelector(".search__result");


async function search(e){
    e.preventDefault();
    while ( searchResult.hasChildNodes()){
        searchResult.removeChild( searchResult.firstChild );       
    }
    const searchWord = document.querySelector(".search__text");

    const {data} =  await Api.get("/api/items",`search?word=${searchWord.value}`);
    data.forEach( item =>{
        const product =  document.createElement("div");
        product.innerHTML = `
        <div id = "${item._id}" class = "card">
            <img src="${item.imageUrl}" class ="productImg">
            <div class="productInfo">
                <p class="name">${item.name}</p>
                <p class="category">${item.category}</p>
                <p class="price">${item.price.toLocaleString('ko-KR')}원</p>
            </div>
        </div>`;
        searchResult.appendChild(product);
        moveTodetailBtn(item._id);
    });
}

searchSubmit.addEventListener("click",search);

// 상품의 이미지 클릭하면 상세페이지로 이동
function moveTodetailBtn(key){
    const container = document.getElementById(`${key}`);
    container.addEventListener("click", ()=>{
        localStorage.setItem("itemDetail",key);
        location.href = "/detail";
    });
}