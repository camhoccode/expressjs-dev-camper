const Review = require("../models/Reviews");
const asyncHandlerErr = require("../middleware/asyncCatchErr");
const Bootcamps = require("../models/Bootcamps");
const ErrorResponse = require("../utils/errorResponse");

// @desc get all reviews
// @route get /api/v1/reviews
// @route get /api/v1/bootcamps/:bootcampId/reviews
// @access public
exports.getReviews = asyncHandlerErr(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResult);
  }
});

// @desc get single review
// @route get /api/v1/reviews/:id
// @access public
exports.getSingleReview = asyncHandlerErr(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!review) {
    return next(new ErrorResponse(`No review id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: review,
    msg: { text: `Show single review` },
  });
});

// @desc post single review
// @route post /api/v1/reviews
// @route post /api/v1/bootcamps/:bootcampId/reviews
// @access private
exports.postReview = asyncHandlerErr(async (req, res, next) => {
  let review;
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
    review = await Review.create(req.body);
  }
  res.status(200).json({
    success: true,
    data: review,
    msg: { text: `Post one review: ${req.body.text}` },
  });
});

// @desc update single review
// @route post /api/v1/reviews/:id
// @access private
exports.updateReview = asyncHandlerErr(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }
  // make sure review belong to user or admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`This user is not authorized to edit this review`, 401)
    );
  }
  await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc delete single review
// @route delete /api/v1/reviews/:id
// @access private
exports.deleteReview = asyncHandlerErr(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }
  // make sure review belong to user or admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `This user is not authorized to delete this review`,
        401
      )
    );
  }
  await review.deleteOne();
  res.status(200).json({
    success: true,
    data: {},
  });
});
