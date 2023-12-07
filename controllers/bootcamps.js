const { default: axios } = require("axios");
const Bootcamp = require(".././models/Bootcamps");
const asyncHandlerErr = require("../middleware/asyncCatchErr");
const ErrorResponse = require("../utils/errorResponse");

// @desc get all bootcamps
// @route get /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandlerErr(async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };
  // field to exclude
  const removeFields = ["select", "sort"];
  removeFields.forEach((field) => delete reqQuery[field]);

  // create query string
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // find bootcamps base on query
  query = Bootcamp.find(JSON.parse(queryStr));
  // select fields
  if (req.query.select) {
    const stringSelectionFields = req.query.select.split(",").join(" ");
    query = query.select(stringSelectionFields);
  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("createdAt");
  }

  const bootcamp = await query;
  res.status(200).json({
    success: true,
    count: bootcamp.length,
    data: bootcamp,
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

// @desc get bootcamps in radius distance
// @route get /api/v1/bootcamps/radius/:zipcode/:distance
// @access private
exports.getBootcampsOnRadius = asyncHandlerErr(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // get lat/lng from zipcode
  const response = await axios.get(
    `https://api.opencagedata.com/geocode/v1/json?q=${zipcode}&key=${process.env.GEOCODER_API_KEY}`
  );
  const loc = response.data.results[0].bounds.northeast;
  const { lat, lng } = loc;

  // calculate radius and divide dist by radisus of earth (earth radius = 3963 mi)
  const radius = distance / 3963;

  const bootcamp = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lat, lng], radius] },
    },
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with distance and radius provided`,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
    count: bootcamp.length,
    msg: {
      text: `Get bootcamps of radius ${req.params.distance} from zipcode ${req.params.zipcode}`,
    },
  });
});
