# 🤗Hugging (명품 가구 쇼핑몰)

<img src="/uploads/6e5587a48d51035ceb9b94710149152f/splashImg.jpg" width="200px">

### '명품의 가치는 변하지 않는다'고 믿는 사람들을 위한 가구 셀렉트샵

제품 등록, 장바구니 추가, 주문하기 등 쇼핑몰의 핵심 서비스를 구현

<br/>

## ✅ 서비스 주요 기능

### 💡 회원가입
- 이메일 인증으로 사용자가 매우 많은 id를 소유할 수 없게함
- 다음 주소 api도입으로 간결한 주소 입력
- <details><summary>시연 영상</summary>
  ![1회원가입](/uploads/816e3f5a80c36b80a588d19efd9eb648/1회원가입.gif)
  </details>

### 💡 로그인
- 소셜로그인 가능
- 비밀번호 찾기 및 수정
- JWT refreshToken 을 이용한 인증 인가
- <details><summary>시연 영상</summary>
  ![2로그인_-비밀번호-찾기](/uploads/3a636f9d789855465c4c03aea1e76de1/2로그인_-비밀번호-찾기.gif)
  </details>

### 💡 홈
- 검색으로 상품 찾기 가능
- 좌측 상단 버튼 클릭시, 카테고리 열람 가능
- <details><summary>시연 영상</summary>
  ![3홈_검색_카테고리](/uploads/1ae7fec61f0e4d6e099118b199f10d87/3홈_검색_카테고리.gif)
  </details>

### 💡 상세페이지 / 장바구니 / 결제
- 상품 상세정보 열람
- 장바구니에 담기
- 장바구니 리스트 중 선택적으로 구매 가능
- 결제 페이지에서 쿠폰을 선택해 할인 적용
- 결제 후 가입한 이메일로 구매 내역 메일 전송
- <details><summary>시연 영상</summary>
  ![4주문_결제](/uploads/070d34bebeeb30e535106ecb69d41724/4주문_결제.gif)
  </details>

### 💡 구매평
- 상세페이지에서 구매평 작성·수정·삭제
  - 해당 상품 구매자만 가능하도록 처리
- <details><summary>시연 영상</summary>
  ![6후기CRUD](/uploads/ba23bbed99b266a6f24e3fd107b97c78/6후기CRUD.gif)
  </details>

### 💡 일반 회원 - 정보 관리
- 관리자와 일반사용자를 구분하여 페이지 변환
- 회원의 구매금액에 따른 등급 확인
- 보유 쿠폰 열람 및 사용
- 주문목록 열람 및 수정
- 회원정보변경 및 탈퇴
- <details><summary>시연 영상</summary>
  ![5일반회원-정보관리](/uploads/d43e40c6307d85a4f49313dbbde6292b/5일반회원-정보관리.gif)
  </details>

### 💡 관리자 - 주문 관리
- 주문 취소 가능
  - 주문이 완전히 삭제되지 않고 '관리자에 의한 취소'로 상태 변경 (데이터 보존)
- 배송상태(배송준비중, 배송중, 배송완료) 변경 가능
  -  배송완료로 변경 후에는 수정 불가
- <details><summary>시연 영상</summary>
  ![7관리자-주문관리](/uploads/32b2c63ac811cb16fb2d03261f781fd0/7관리자-주문관리.gif)
  </details>

### 💡 관리자 - 상품 관리
- 상품을 추가 및 수정
- multer를 통해 이미지 업로드
- 상품 삭제시, 구매자가 있는 경우에는 상품이 사라지지 않고 '판매중지' 처리됨
- 카테고리가 삭제된 상품은 '미설정' 카테고리에서 확인 가능(데이터 보존)
- <details><summary>시연 영상</summary>
  ![8관리자-상품관리](/uploads/c58a3dfa63e247e713cfb6a2a9135b1d/8관리자-상품관리.gif)
  </details>

### 💡 관리자 - 카테고리 관리
- 카테고리 추가 및 수정 가능
  - 포함 카테고리가 없어진 상품은 상품 조회에서 '미설정' 선택시 열람 가능 (데이터 보존)
- <details><summary>시연 영상</summary>
  ![9관리자-카테고리관리](/uploads/e92db08183d09f36bd437ba5e74661a2/9관리자-카테고리관리.gif)
  </details>
<br/>

## ✅ 페이지별 화면

|  |  |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------|
| ![1홈](/uploads/46e811e66b08fb119aece103ce6fcd0a/1홈.png) | ![image](/uploads/62f2a92bcc69c760cfdb73629fbf2c30/image.png) |
| 메인 페이지(1) | 메인 페이지(2) |
| ![3회원가입](/uploads/e91bbfe4cf665b331d6f7f96d9b42524/3회원가입.PNG) | ![4로그인](/uploads/bff799de6c5f8c059748a4406f42fbff/4로그인.PNG) |
| 회원가입 | 로그인 |
| ![5카테고리](/uploads/fe59b3cfcc7f20955ed3c8d7357682af/5카테고리.PNG)| ![5-1상세페이지](/uploads/fdd55384cf582586d934e77fb908c7cc/5-1상세페이지.png)  |
| 카테고리 | 상세페이지 |
| ![6장바구니](/uploads/2f54bebd87e94f0400d211b572e2512d/6장바구니.PNG) | ![7결제](/uploads/6b184a7e33af6cb399ca709d8e367a87/7결제.png) |
| 장바구니 | 결제 |
| ![일반회원-주문조회](/uploads/de5b950d5466b74ce420a3c3cd10ab4f/일반회원-주문조회.png) | ![일반회원-정보수정](/uploads/a2f63bae97dcea1361484146ee9e3527/일반회원-정보수정.png) |
| 일반 회원 - 주문 관리 | 일반 회원 - 정보 관리 |
| ![8관리자-주문조회](/uploads/12e6cb38fcacab4a8e4de780cfa4314b/8관리자-주문조회.PNG) | ![관리자-카테고리관리](/uploads/bd4138bbfc123577c63e8e9f6b0064ce/관리자-카테고리관리.PNG) |
| 관리자 - 주문 관리 | 관리자 - 카테고리 관리 |
| ![image](/uploads/8face4bd55b8d2540ab5abe43ebcd317/image.png) | ![image](/uploads/27db81981fabc2f2ede329163ed9d671/image.png) |
| 관리자 - 상품 조회 | 관리자 - 상품 등록 |

### 💡 [배포링크](https://jinytree.shop)

### 💡 [시연영상 full](https://youtu.be/t5Dc9RnDJao)

### 💡 테스트 계정

|           | 이메일            | 비밀번호  |
| --------- | ----------------- | --------- |
| 일반 회원 | a@a.a             | 123123123 |
| 관리자    | admin@hugging.com | 123123123 |


<br/>

## ✅ 기술스택

### 프론트엔드

  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=HTML5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=CSS3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/>

### 백엔드

  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/express-000000?style=flat-square&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white"/>

  <img src="https://img.shields.io/badge/NGINX-009639?style=flat-square&logo=NGINX&logoColor=white"/>
  <img src="https://img.shields.io/badge/PM2-2B037A?style=flat-square&logo=PM2&logoColor=white"/>


<br/>
<br/>

## ✅ 기획

### 1. 정보구조도(다이어그램)
<img src="/uploads/908fa6461b2cbf603069ad8543de77fd/다이어그램.png" width="500px">

### 2. [와이어 프레임](https://www.figma.com/file/33a0PITPQ3GaelQ2EgduNK/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=1%3A2&t=NXWFCEgiHzGDyfV3-1)

### 2. [API 명세서](https://prickle-fern-9fe.notion.site/API-a1a1b003fbda4db885bebd36d528b7d0)

<br/>

## ✅ 인프라 구조

<img src="https://i.ibb.co/9tGxmx0/image.png" width=500 />

<br/>

## ✅ 폴더 구조

- 프론트: `src/views` 폴더
- 백: src/views 이외 폴더 전체
- 실행: **프론트, 백 동시에, express로 실행**

<br/>

## ✅ 제작자

| 이름   | 담당 업무 |
| ------ | --------- |
| 허혜실 | 팀장/FE   |
| 곽지우 | FE        |
| 박지혜 | FE        |
| 손형석 | BE        |
| 이진희 | BE        |

<br />
