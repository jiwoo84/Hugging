const modal = `
<div class="modal-card" style="border:black solid 1px">
    <img src="../elice-rabbit.png" alt="item"/>
    <h3 class="item-name">sofa</h3>
    <button class="plus">+</button>
    <label class="quantity">1</label>
    <button class="minus">-</button>
    <p class="item-price">1000</p>
</div>
`;

if (window.indexedDB) {
    const databaseName = 'cart';
    const version = 1;

    const request = indexedDB.open(databaseName, version);

    const data = {
        id :1,
        name: "sofa"
    };

    request.onupgradeneeded = function () {
        // Object Store 생성
        // 데이터베이스 아래 객체 스토어라는 이름으로 또다시 객체를 만들 수 있습니다.
        request.result.createObjectStore('items', { autoIncrement: true });
    };

    request.onsuccess = function () {
        const store = request.result
            .transaction('item', 'readwrite')
            .objectStore('items');
            // transaction : 통신 , items 객체스토어의 권한을 readwrite로 설정
            // objectStore : 오브젝트스토어를 가져옴

        //데이터저장
        store.add(data);
    };

    reader.onerror = function (error) {
        alert('Error: ', error);
        document.querySelector('body').removeChild(modalEl);
    };
}