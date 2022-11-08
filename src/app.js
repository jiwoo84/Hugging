import cors from "cors";
import express from "express";
import {
  itemRouter,
  viewsRouter,
  userRouter,
  orderRouter,
  categoryRouter,
  sosialRouter,
  commentRouter,
} from "./routers";
import { errorHandler } from "./middlewares";
import mongoose from "mongoose";
import { Item } from "./db";
const app = express();

// 어드민브로 필요시 주석해제
// import AdminBro from "admin-bro";
// import AdminBroExpress from "@admin-bro/express";
// import AdminBroMongoose from "@admin-bro/mongoose";

// AdminBro.registerAdapter(AdminBroMongoose);
// const adminBro = new AdminBro({
//   databases: [mongoose],
//   rootPath: "/admin",
// });
// const adminPage = AdminBroExpress.buildRouter(adminBro);
// app.use(adminBro.options.rootPath, adminPage);

// CORS 에러 방지
app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

//
app.use("/uploads", express.static("uploads"));

// html, css, js 라우팅
app.use(viewsRouter);
// api 라우팅
// 아래처럼 하면, userRouter 에서 '/login' 으로 만든 것이 실제로는 앞에 /api가 붙어서
// /api/login 으로 요청을 해야 하게 됨. 백엔드용 라우팅을 구분하기 위함임.
app.use("/api/users", userRouter);
app.use("/api/sosial", sosialRouter);
app.use("/api/items", itemRouter);
app.use("/api/orders", orderRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/comments", commentRouter);

// 순서 중요 (errorHandler은 다른 일반 라우팅보다 나중에 있어야 함)
// 그래야, 에러가 났을 때 next(error) 했을 때 여기로 오게 됨
app.use(errorHandler);

export { app };
