import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true })); // 익스프레스가 Form의 내용을 자바스크립트 형식으로 변환하는 코드
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false, // 모든 사용자가 접속했을 때 쿠키를 DB에 저장하는 것을 방지
    saveUninitialized: false, // request 때 생성된 이후로 아무런 작업이 가해지지않는 초기상태의 세션을 저장한다.
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
