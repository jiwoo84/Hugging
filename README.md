# 🤗Hugging (명품 가구 쇼핑몰)

<div>

<!-- <img alt="쇼핑-데모 " src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fa22809bd-043a-42ab-b219-b0466a1a969d%2FUntitled.png?table=block&id=ae83c156-267f-455d-90d9-619ca7dd3d7f&spaceId=beaa8bbc-f504-4c20-b220-9fc699f70e12&width=2000&userId=14cc2ef3-04b9-41f7-9991-3bf06bfcb033&cache=v2"> -->

<img src="https://user-images.githubusercontent.com/86906350/201465001-6432ab69-7249-494a-a0ac-2b894a7695cd.png" width=500>
<br />
<img src ="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fea69ef50-1b49-4bed-b23d-90dc5d28591f%2FUntitled.png?table=block&id=5a1f67c2-d498-4a43-b7cd-aede8feb5239&spaceId=beaa8bbc-f504-4c20-b220-9fc699f70e12&width=1850&userId=14cc2ef3-04b9-41f7-9991-3bf06bfcb033&cache=v2" width=150>
</div>

<br />

## ✅ 서비스 소개

#### 해외 유명 가구 전문 쇼핑몰입니다.

제품 등록, 장바구니 추가, 주문하기 등 쇼핑몰의 핵심 서비스를 구현합니다.

- 대상 페르소나: '명품의 가치는 변하지 않는다' 를 믿는 사람들 대상

### 💡 기술스택

- **프론트엔드**

  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=HTML5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=CSS3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/>

- **백엔드**

  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/express-000000?style=flat-square&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white"/>

  <img src="https://img.shields.io/badge/NGINX-009639?style=flat-square&logo=NGINX&logoColor=white"/>
  <img src="https://img.shields.io/badge/PM2-2B037A?style=flat-square&logo=PM2&logoColor=white"/>

### 💡 배포링크

### https://jinytree.shop

### 💡 시연영상 링크

### https://youtu.be/t5Dc9RnDJao

### 시연 가능 계정

|           | 이메일            | 비밀번호  |
| --------- | ----------------- | --------- |
| 일반 회원 | a@a.a             | 123123123 |
| 관리자    | admin@hugging.com | 123123123 |

<br>

## ✅ 서비스 주요 기능 설명

### 2-1 로그인

- 소셜로그인 및 회원가입
- 비밀번호 찾기 및 수정
- JWT refreshToken 을 이용한 인증 인가

### 2-2 회원가입

- 이메일 인증으로 사용자가 매우 많은 id를 소유할 수 없게함
- 다음 주소 api도입으로 간결한 주소 입력

### 2-3 회원

- 관리자와 일반사용자를 구분하여 페이지 변환
- 보유 쿠폰 열람 및 사용
- 주문목록 열람 및 수정
- 회원정보변경 및 탈퇴
- 회원의 구매금액에 따른 등급 확인

### 2-4 상품

- 상품 상세정보 열람
- 장바구니에 담아 구매
- 장바구니 리스트 중 선택적으로 구매
- 쿠폰을 선택해 할인 적용
- 구매평(리뷰) 작성·수정·삭제
  - 해당 상품 구매자만 가능하도록 처리

### 2-4 관리자

- 상품을 추가 및 수정
- 주문 취소 가능
  - 주문이 완전히 삭제되지 않고 '관리자에 의한 취소'로 상태 변경 (데이터 보존)
- 배송상태 변경 가능
- 카테고리 추가 및 수정 가능
  - 포함 카테고리가 없어져도 상품 조회에서 '미설정' 선택시 열람 가능 (데이터 보존)

<br>

## ✅ 상세 구조

### 💡 API 문서

<img src="https://user-images.githubusercontent.com/86906350/201463783-435c8ddf-ffc0-4002-b9e7-c7ff04acdd61.png" width=500 />

[문서 구경하기(클릭)](https://www.notion.so/elice/API-7dc294fdb2064d5bbdc2a82dd769a02d)

<br>

### 💡 인프라 구조

<img src="https://i.ibb.co/9tGxmx0/image.png" width=500 />

### 💡 폴더 구조

- 프론트: `src/views` 폴더
- 백: src/views 이외 폴더 전체
- 실행: **프론트, 백 동시에, express로 실행**

<br>

## ✅ 제작자

| 이름   | 담당 업무 |
| ------ | --------- |
| 허혜실 | 팀장/FE   |
| 곽지우 | FE        |
| 박지혜 | FE        |
| 손형석 | BE        |
| 이진희 | BE        |

<br />

## ✅ 실행 방법

1. 레포지토리를 클론하고자 하는 디렉토리에서 아래 명령어를 수행

```bash
git clone https://kdt-gitlab.elice.io/sw_track/class_03/web_project/team24/hugging.git
```

2. 클론한 디렉토리에서 backend 디렉토리로 들어가 아래 명령어를 통해 backend에서 필요한 module 설치

```bash
npm install
```

3. backend에서 필요한 `.env` 설정

```bash
MONGODB_URL = "mongodb+srv://hyeongseok:sk95774949@simple-board-cluster.lmdzbhe.mongodb.net/?retryWrites=true&w=majority"
JWT_SECRET_KEY = "sdfkdsfdks234324324fdfsdfasdc234d56gv"
KAKAO_KEY = "b31d49b6f0bf75da1049dab201b9f2b1"
KAKAO_REDIRECT = "http://localhost:5000/sosial"
KAKAO_SECRET="L4soeSogvXh8kyLQIJO7k9ZEAxrSwUtl"

MY_DOMAIN = "http://localhost:5000/"
PORT=5000
SEND_MAILID = "네이버 메일"
SEND_MAILID_PW = "네이버 패스워드"
SEND_MAILID_PORT = "587"

## 단, 메일설정에서 보내기 허가가 되어있어야함.
```

4. express 앱을 실행

```bash
npm start
```

<br>
