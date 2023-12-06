const Bootcamp = require(".././models/Bootcamps");
const asyncHandlerErr = require("../middleware/asyncCatchErr");
const ErrorResponse = require("../utils/errorResponse");

// @desc get all bootcamps
// @route get /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandlerErr(async (req, res, next) => {
  const bootcamp = await Bootcamp.find();
  res.status(200).json({
    success: true,
    data: bootcamp,
    count: bootcamp.length,
    msg: { text: `Show all bootcamps` },
  });
});

// @desc get one bootcamp
// @route get /api/v1/bootcamps/:id
// @access public

exports.getOneBootcamp = asyncHandlerErr(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
    msg: { text: `Show one bootcamp id of ${req.params.id}` },
  });
});

// @desc post one bootcamp
// @route post /api/v1/bootcamps
// @access private
exports.postBootcamp = asyncHandlerErr(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
    msg: { text: "Create new bootcamp" },
  });
});

// @desc put one bootcamp
// @route put /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = asyncHandlerErr(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
    msg: { text: `Change a bootcamp id of ${req.params.id}` },
  });
});

// @desc delete one bootcamp
// @route delete /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandlerErr(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
    msg: { text: `Delete a bootcamp id of ${req.params.id}` },
  });
});
