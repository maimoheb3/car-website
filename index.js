import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDb from "./config/db.js";

// Updated routers
import carsRouter from "./routes/car.js";
import ordersRouter from "./routes/order.js";
import usersRouter from "./routes/user.js";
import frontRouter from "./routes/frontend.js";

const app = express();
const port = 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.use("/api/car", carsRouter);
app.use("/api/order", ordersRouter);
app.use("/api/user", usersRouter);
app.use(frontRouter);

app.use((req, res, next) => {
  res.status(404).render("404");
});

// DB connection
connectDb();

// Server
app.listen(port, () => {
  console.log(`Car store app listening on port ${port}`);
});
