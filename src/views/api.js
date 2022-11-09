// api 로 GET 요청 (/endpoint/params 형태로 요청함)
async function get(endpoint, params = "") {
  const apiUrl = `${endpoint}/${params}`;
  console.log(`%cGET 요청: ${apiUrl} `, "color: #a25cd1;");

  const res = await fetch(apiUrl, {
    // JWT 토큰을 헤더에 담아 백엔드 서버에 보냄.
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // 응답 코드가 4XX 계열일 때 (400, 403 등)
  if (!res.ok) {
    const errorContent = await res.json();
    const { msg } = errorContent;
    console.log(msg);
    // 만약 AT가 만료되었다는 에러라면 발급후 재요청 해야함
    if (msg === "정상적인 토큰이 아닙니다.") {
      console.log("토큰 재발급후 재요청할 url : ", apiUrl.slice(0, -1));
      // refresh 함수는 true , 또는 로그인창화면을 리턴한다
      const refreshToken = await refresh(localStorage.getItem("refreshToken"));
      if (refreshToken) {
        console.log();
        await get(endpoint, params);
        return;
      }
    }
    alert(msg);
    throw new Error(msg);
  }
  const result = await res.json();
  console.log(result);
  return result;
}

// 토큰 검증실패시 재발급을 위한 api
async function refresh(rt) {
  console.log("들어왔어 리프레쉬!");
  const data = JSON.stringify({ refreshToken: rt });
  console.log(data);
  const refresh = await fetch("/api/users/refresh", {
    method: "Post",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await refresh.json();
  // RT 마저 만료되었다면 로그인창으로 보냄
  // 요건 잘됨
  if (!refresh.ok) {
    console.log("에러냐 ?");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    return (window.location.href = "/login");
  }
  // 토큰 교체
  console.log("토큰교체");
  console.log(result);
  console.log(result.token);
  console.log(result.refreshToken);
  localStorage.setItem("token", result.token);
  localStorage.setItem("refreshToken", result.refreshToken);
  return true;
}
// api 로 POST 요청 (/endpoint 로, JSON 데이터 형태로 요청함)
// endpoint : api/user/login
async function post(endpoint, data) {
  const apiUrl = endpoint;

  // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
  // 예시: {name: "Kim"} => {"name": "Kim"}

  const bodyData = JSON.stringify(data);
  console.log(`%cPOST 요청: ${apiUrl}`, "color: #296aba;");
  console.log(`%cPOST 요청 데이터: ${bodyData}`, "color: #296aba;");

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: bodyData,
  });

  // 응답 코드가 4XX 계열일 때 (400, 403 등)
  if (!res.ok) {
    const errorContent = await res.json();
    const { msg } = errorContent;
    console.log(msg);
    // 만약 AT가 만료되었다는 에러라면 발급후 재요청 해야함
    if (msg === "정상적인 토큰이 아닙니다.") {
      console.log("토큰 재발급후 재요청할 url : ", apiUrl.slice(0, -1));
      // refresh 함수는 true , 또는 로그인창화면을 리턴한다
      const refreshToken = await refresh(localStorage.getItem("refreshToken"));
      if (refreshToken) {
        await post(endpoint, data);
        return;
      }
    }
    alert(msg);
    throw new Error(msg);
  }

  const result = await res.json();
  return result;
}

// api 로 PATCH 요청 (/endpoint/params 로, JSON 데이터 형태로 요청함)
async function patch(endpoint, params = "", data) {
  const apiUrl = `${endpoint}/${params}`;

  // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
  // 예시: {name: "Kim"} => {"name": "Kim"}
  const bodyData = JSON.stringify(data);
  console.log(`%cPATCH 요청: ${apiUrl}`, "color: #059c4b;");
  console.log(`%cPATCH 요청 데이터: ${bodyData}`, "color: #059c4b;");

  const res = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: bodyData,
  });

  // 응답 코드가 4XX 계열일 때 (400, 403 등)
  if (!res.ok) {
    const errorContent = await res.json();
    const { msg } = errorContent;
    console.log(msg);
    // 만약 AT가 만료되었다는 에러라면 발급후 재요청 해야함
    if (msg === "정상적인 토큰이 아닙니다.") {
      console.log("토큰 재발급후 재요청할 url : ", apiUrl.slice(0, -1));
      // refresh 함수는 true , 또는 로그인창화면을 리턴한다
      const refreshToken = await refresh(localStorage.getItem("refreshToken"));
      if (refreshToken) {
        await patch(endpoint, params, data);
        return;
      }
    }
    alert(msg);
    throw new Error(msg);
  }
  const result = await res.json();
  return result;
}

// 아래 함수명에 관해, delete 단어는 자바스크립트의 reserved 단어이기에,
// 여기서는 우선 delete 대신 del로 쓰고 아래 export 시에 delete로 alias 함.
async function del(endpoint, params = "", data = {}) {
  const apiUrl = `${endpoint}/${params}`;
  const bodyData = JSON.stringify(data);

  console.log(`DELETE 요청 ${apiUrl}`);
  console.log(`DELETE 요청 데이터: ${bodyData}`);

  const res = await fetch(apiUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: bodyData,
  });

  // 응답 코드가 4XX 계열일 때 (400, 403 등)
  if (!res.ok) {
    const errorContent = await res.json();
    const { msg } = errorContent;
    console.log(msg);
    // 만약 AT가 만료되었다는 에러라면 발급후 재요청 해야함
    if (msg === "정상적인 토큰이 아닙니다.") {
      console.log("토큰 재발급후 재요청할 url : ", apiUrl);
      // refresh 함수는 true , 또는 로그인창화면을 리턴한다
      const refreshToken = await refresh(localStorage.getItem("refreshToken"));
      if (refreshToken) {
        await del(apiUrl, params, data);
        return;
      }
    }
    alert(result.msg);
    throw new Error(msg);
  }

  const result = await res.json();

  return result;
}

// 아래처럼 export하면, import * as Api 로 할 시 Api.get, Api.post 등으로 쓸 수 있음.
export { get, post, patch, del as delete, refresh };
