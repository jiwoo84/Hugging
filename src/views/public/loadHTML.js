function loadHTML(file) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        document.write(allText);
      }
    }
  };
  rawFile.send(null);
}

const logoutBtn = document.querySelector("#logout");
const logout = () => {
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
  localStorage.removeItem("loggedIn");
  alert("로그아웃 완료");
  window.location.href = "/";
};
const mypage = async () => {
  const res = await fetch("/api/users/mypage", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const json = await res.json();
  const url = json.url;
  console.log(url === undefined);
  if (url === undefined) {
    window.location.href = "/mypage";
    return;
  }
  window.location.href = url;
};
