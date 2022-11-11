const findPw = document.getElementById("findPw");
const findwPwForm = document.getElementById("findwPwForm");
const makeForm = async () => {
  console.log("들어옴");
  findwPwForm.innerHTML = `
        <input placeholder="가입한 이메일을 입력해주세요" id="findPwInput"/>
    `;
  const form = document.createElement("form");
  const authInput = document.createElement("input");
  authInput.placeholder;
};

findPw.addEventListener("click", makeForm);
