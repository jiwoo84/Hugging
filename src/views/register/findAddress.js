const postalCodeInput = document.querySelector("#postalCodeInput");
const address1Input = document.querySelector("#address1Input");
const address2Input = document.querySelector("#address2Input");
function findAddress(){
    new daum.Postcode({
    oncomplete: function (data) {
        let addr = "";
        let extraAddr = "";

        if (data.userSelectedType === "R") {
            addr = data.roadAddress;
        } else {
            addr = data.jibunAddress;
        }

        if (data.userSelectedType === "R") {
            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
            }
            if (data.buildingName !== '' && data.apartment === "Y") {
            extraAddr +=
                extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
            }
            if (extraAddr !== "") {
            extraAddr = " ("  + extraAddr + ")";
            }
        } else {
        }

        postalCodeInput.value = data.zonecode;
        address1Input.value = `${addr} ${extraAddr}`;
        address2Input.placeholder = "상세 주소를 입력해 주세요.";
        address2Input.focus();
        },
    }).open({ autoClose: true});
}

export {findAddress};