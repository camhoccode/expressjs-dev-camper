const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/db");

// route
const bootcamps = require("./routes/bootcamps");
// middleware
const morgan = require("morgan");

// load env var
dotenv.config({ path: "./config/config.env" });

// connect to db
connectDb();

const app = express();

// dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// mount router
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// haldle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // close server
  server.close(() => process.exit(1));
});
