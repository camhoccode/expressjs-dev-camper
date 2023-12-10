const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const color = require("colors");
const path = require("path");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");

// route
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const user = require("./routes/user");
// middleware
const morgan = require("morgan");
const errorHandler = require("./middleware/error");

// load env var
dotenv.config({ path: "./config/config.env" });

// connect to db
connectDb();

const app = express();

// use cookie parser
app.use(cookieParser());

// body parser
app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// file upload middleware
app.use(fileupload());
// set static folder
app.use(express.static(path.join(__dirname, "public")));

// mount router
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", user);
// dev error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// haldle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close server and exit process
  server.close(() => process.exit(1));
});
