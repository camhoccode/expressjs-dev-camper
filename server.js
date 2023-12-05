const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDb = require("./config/db");

// route
const bootcamps = require("./routes/bootcamps");
// middleware
const morgan = require("morgan");
const errorHandler = require("./middleware/error");

// load env var
dotenv.config({ path: "./config/config.env" });

// connect to db
connectDb();

const app = express();

// body parser
app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// mount router
app.use("/api/v1/bootcamps", bootcamps);
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
