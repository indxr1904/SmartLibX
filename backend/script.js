const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/userRouter");
const bookRouter = require("./routes/bookRouter");
const copiesRouter = require("./routes/copiesRouter");
const bookCollectionRouter = require("./routes/collectionRouter");
const dashboardRouter = require("./routes/dashboardRouter");
const cors = require("cors");
const script = express();

script.use(express.json());

script.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

if (process.env.NODE_ENV === "development") {
  script.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("SmartLibX API is running");
});

script.use((req, res, next) => {
  console.log("Hello from middleware");

  next();
});

script.use("/api/v1/users", userRouter);
script.use("/api/v1/books", bookRouter);
script.use("/api/v1/copies", copiesRouter);
script.use("/api/v1/assignment", bookCollectionRouter);
script.use("/api/v1/bookcollection", bookCollectionRouter);
script.use("/api/v1/dashboard", dashboardRouter);

script.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.errMessage || err.message,
  });
});

module.exports = script;
