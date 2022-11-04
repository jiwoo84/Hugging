import mongoose from "mongoose";
import { Category } from "./models/category-model";
import { Item } from "./models/item-model";
import { Order } from "./models/order-model";
import { User } from "./models/user-model";

const DB_URL =
  process.env.MONGODB_URL ||
  "MongoDB 서버 주소가 설정되지 않았습니다.\n./db/index.ts 파일을 확인해 주세요. \n.env 파일도 필요합니다.\n";

mongoose.connect(DB_URL);
const db = mongoose.connection;

db.on("connected", async () => {
  console.log("정상적으로 MongoDB 서버에 연결되었습니다.  " + DB_URL);
  await Item.deleteMany({});
  await User.deleteOne({ name: "관리자" });
  await Order.deleteMany({});
  await Category.deleteMany({});
  const admin = await User.insertMany([
    {
      email: "admin@hugging.com",
      name: "관리자",
      password: "123123123",
      address: "엘리스 랩실",
      phoneNumber: "010-0000-0000",
      role: "admin",
    },
  ]);
  const fakeItems = await Item.insertMany([
    {
      name: "모던 체어",
      category: "홈",
      price: 4000,
      itemDetail: "대박 쩌는 모던체어",
      imageUrl:
        "https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F850c7b59-c215-4555-b42a-42b6f0d7739e%2FUntitled.png?table=block&id=9edba707-a9c7-40fd-a49d-0c00ee226fd9&spaceId=beaa8bbc-f504-4c20-b220-9fc699f70e12&width=2000&userId=14cc2ef3-04b9-41f7-9991-3bf06bfcb033&cache=v2",
      sales: 10,
      onSale: true,
    },
    {
      name: "덜 모던한 체어",
      category: "오피스",
      price: 1000,
      itemDetail: "흠 뭔가 좀 아쉽긴한데 가격이 싼 의자",
      imageUrl:
        "https://www.ikea.com/kr/ko/images/products/odger-chair-white-beige__0727334_pe735606_s5.jpg?f=xl",
      sales: 2,
      onSale: true,
    },
    {
      name: "조금 모던한 체어",
      category: "오피스",
      price: 12000,
      itemDetail:
        "이상하죠? 모던 체어는 4000원인데 조금 모던한건 12,000원이네요",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmNMllN2lI29wrYPUKsDpqiKdy7Zvoghv4TQ&usqp=CAU",
      sales: 14,
      onSale: true,
    },
    {
      name: "고급 의자",
      category: "오피스",
      price: 1000,
      itemDetail: "아무리 봐도 고급의자 인지는 모르겠는 고급의자",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbi5eePzkebsDmzGp8s6JWU9aA7enSm464Lw&usqp=CAU",
      sales: 0,
      onSale: true,
    },
    {
      name: "기본 테이블",
      category: "홈",
      price: 10000,
      itemDetail: "이건 이미지가 생각이 안남 암튼 테이블임",
      imageUrl:
        "data:image/png;base64,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",
      sales: 2,
      onSale: true,
    },
    {
      name: "멋있는 테이블",
      category: "오피스",
      price: 10200,
      itemDetail: "멋있는 테이블입니다.",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSThD05wMOmwEeu3Vbe94JDBhWpHBnB--VXXA&usqp=CAU",
      sales: 24,
      onSale: true,
    },
    {
      name: "간지나는 테이블",
      category: "오피스",
      price: 1000,
      itemDetail: "이건 사무실에 놓으면 모두가 일하고 싶어합니다.",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScdOpQMeEJI2409o8i3_b1oo48pZMnDDsU-g&usqp=CAU",
      sales: 2,
      onSale: true,
    },
    {
      name: "으아악 책상",
      category: "오피스",
      price: 1000,
      itemDetail: "으아아아악 책상",
      imageUrl:
        "data:image/jpeg;base64,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",
      sales: 140,
      onSale: true,
    },
  ]);
  await Category.insertMany([
    {
      name: "홈",
      index: 1,
    },
    {
      name: "오피스",
      index: 2,
    },
    {
      name: "아웃도어",
      index: 3,
    },
  ]);
  await Order.insertMany([
    {
      deliveryStatus: "발송완료",
      orderStatus: "수정불가",
      items: [
        {
          id: fakeItems[0]._id,
          count: 2,
        },
        {
          id: fakeItems[1]._id,
          count: 2,
        },
        {
          id: fakeItems[2]._id,
          count: 2,
        },
        {
          id: fakeItems[3]._id,
          count: 2,
        },
      ],
      buyer: admin[0]._id,
      totalPrice: 50530,
    },
    {
      deliveryStatus: "배송준비중",
      orderStatus: "수정가능",
      items: [
        {
          id: fakeItems[4]._id,
          count: 2,
        },
        {
          id: fakeItems[5]._id,
          count: 2,
        },
        {
          id: fakeItems[6]._id,
          count: 2,
        },
        {
          id: fakeItems[7]._id,
          count: 2,
        },
      ],
      buyer: admin[0]._id,
      totalPrice: 50530,
    },
    {
      deliveryStatus: "배송준비중",
      orderStatus: "수정가능",
      items: [
        {
          id: fakeItems[1]._id,
          count: 2,
        },
        {
          id: fakeItems[2]._id,
          count: 2,
        },
        {
          id: fakeItems[5]._id,
          count: 2,
        },
        {
          id: fakeItems[7]._id,
          count: 2,
        },
      ],
      buyer: admin[0]._id,
      totalPrice: 50530,
    },
  ]);
});
db.on("error", (error) =>
  console.error("\nMongoDB 연결에 실패하였습니다...\n" + DB_URL + "\n" + error)
);

// user-model.js 에서 export { ~~ } 한 모듈을 그대로 다시 export해 줌
// 이렇게 하면, 나중에 import 할 때 코드가 짧아짐
// 예시로, import userModel from '../db/models/user-model' 대신 from '../db' 가 됨
// '../db/index.js' 에서 index.js 는 생략 가능하므로, '../db' 면 됨 (index는 특별한 용어)
export * from "./models/item-model";
export * from "./models/user-model";
export * from "./models/order-model";
export * from "./models/category-model";
