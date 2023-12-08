const Course = require(".././models/Course");
const asyncHandlerErr = require("../middleware/asyncCatchErr");
const ErrorResponse = require("../utils/errorResponse");

// @desc get all courses or courses for certain bootcamps
// @route get /api/v1/courses
// @route get /api/v1/bootcamps/:bootcampId/courses
// @access public
exports.getCourses = asyncHandlerErr(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
    msg: { text: `Show all courses` },
  });
});
