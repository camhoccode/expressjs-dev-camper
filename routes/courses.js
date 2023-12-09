const express = require("express");
const {
  getCourses,
  getCourse,
  postCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
const Course = require("../models/Course");
const advancedResult = require("../middleware/advancedResult");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResult(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(postCourse);
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
