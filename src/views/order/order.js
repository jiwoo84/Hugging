import * as Api from "/api.js";

const orderedMan= document.querySelector(".orderedMan");
const orderedAdress= document.querySelector(".orderedAdress");

// 요소(element), input 혹은 상수
getDataFromApi();

async function getDataFromApi() {
    const user = await Api.get("/api/users","mypage");
    const {name, address, phoneNumber} =user.data;
    addUserComponent(name,address,phoneNumber);

}

function addUserComponent(name,address,phoneNumber){
    const nameInfo =  document.createElement("div");
    const addressInfo = document.createElement("div");
    
    nameInfo.innerHTML = `<p>${name}</p>`;
    addressInfo.innerHTML = `
        <p>${name}</p>
        <p>${address}</p>
        <p>${phoneNumber}</p>
    `;

    orderedMan.appendChild(nameInfo);
    orderedAdress.appendChild(addressInfo);
}