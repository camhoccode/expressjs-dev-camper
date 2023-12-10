const Course = require(".././models/Course");
const asyncHandlerErr = require("../middleware/asyncCatchErr");
const Bootcamps = require("../models/Bootcamps");
const ErrorResponse = require("../utils/errorResponse");

// @desc get all courses or courses for certain bootcamps
// @route get /api/v1/courses
// @route get /api/v1/bootcamps/:bootcampId/courses
// @access public
exports.getCourses = asyncHandlerErr(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
      msg: { text: `Show all courses for a bootcamp` },
    });
  } else {
    res.status(200).json(res.advancedResult);
  }
});

// @desc get single course
// @route get /api/v1/courses/:id
// @access public
exports.getCourse = asyncHandlerErr(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(new ErrorResponse(`No course id of ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    data: course,
    msg: { text: `Show single course` },
  });
});

// @desc post single course
// @route post /api/v1/courses
// @route post /api/v1/bootcamps/:bootcampId/courses
// @access private
exports.postCourse = asyncHandlerErr(async (req, res, next) => {
  let course;
  req.body.user = req.user.id;
  if (req.params.bootcampId) {
    req.body["bootcamp"] = req.params.bootcampId;
    const bootcamp = await Bootcamps.findById(req.params.bootcampId);
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `Bootcamp not found with id of ${req.params.bootcampId}`,
          404
        )
      );
    }
    // make sure user own bootcamp
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.user.id} not authorised to post course to this bootcamp ${req.params.bootcampId}`,
          401
        )
      );
    }
    course = await Course.create(req.body);
  } else {
    next(new ErrorResponse(`Please add bootcamp id in the request`));
  }

  res.status(200).json({
    success: true,
    data: course,
    msg: { text: `Post one course title: ${req.body.title}` },
  });
});

// @desc update single course
// @route put /api/v1/courses/:id
// @access private
exports.updateCourse = asyncHandlerErr(async (req, res, next) => {
  let course;
  course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`Invalid course id in the request`));
  }
  // make sure user own course
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not authorised to update course, id course: ${req.params.id}`,
        401
      )
    );
  }
  course = await Course.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
    msg: { text: `Update one course id of ${req.params.id}` },
  });
});

// @desc delete single course
// @route delete /api/v1/courses/:id
// @access private
exports.deleteCourse = asyncHandlerErr(async (req, res, next) => {
  let course;
  course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorResponse(`Invalid course id in the request`));
  }
  course = await Course.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
    msg: { text: `Delete one course id of ${req.params.id}` },
  });
});
