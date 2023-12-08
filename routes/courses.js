const express = require("express");
const { getCourses } = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

// router.route("/bootcamps/:bootcampId/courses").get(getCourses);
router.route("/").get(getCourses);

module.exports = router;
