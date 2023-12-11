const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// load env var
dotenv.config({ path: "./config/config.env" });

// load model
const Bootcamp = require("./models/Bootcamps");
const Course = require("./models/Course");
const User = require("./models/User");
const Review = require("./models/Reviews");

// connect to db
mongoose.connect(process.env.MONGO_URI);

// read json file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
);

// import into db
const importData = async () => {
  try {
    await Promise.all([
      Bootcamp.create(bootcamps),
      Course.create(courses),
      User.create(users),
      Review.create(reviews),
    ]);
    console.log("Data imported...".green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};
// delete data in db
const deleteData = async () => {
  try {
    await Promise.all([
      Bootcamp.deleteMany(),
      Course.deleteMany(),
      User.deleteMany(),
      Review.deleteMany(),
    ]);
    console.log("Data destroyed...".red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
