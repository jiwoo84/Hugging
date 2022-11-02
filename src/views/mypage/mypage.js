import * as Api from "/api.js";

window.addEventListener("load", getName);

async function getName() {
    const user = await Api.get('/api/users/mypage');
    const { user } = 
}
