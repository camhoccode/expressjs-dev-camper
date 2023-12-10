const { default: axios } = require("axios");
const path = require("path");
const Bootcamp = require(".././models/Bootcamps");
const asyncHandlerErr = require("../middleware/asyncCatchErr");
const ErrorResponse = require("../utils/errorResponse");

// @desc get all bootcamps
// @route get /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandlerErr(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
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
  // add user tp req.body
  req.body.user = req.user.id;

  // check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.body.user });
  // non-admin user can only publish one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with id ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

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
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  // make sure user own bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `Bootcamp not authorised to be changed for this user, user id of ${req.user.id}`,
        401
      )
    );
  }
  bootcamp = await Bootcamp.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

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
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  } // make sure user own bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `Bootcamp not authorised to be changed for this user id of ${req.user.id}`,
        401
      )
    );
  }

  await Bootcamp.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    data: {},
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

// @desc upload photo for bootcamp
// @route put /api/v1/bootcamps/:id/photo
// @access private
exports.uploadPhotoBootcamp = asyncHandlerErr(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  // make sure user own bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `Bootcamp not authorised to be changed for this user id of ${req.user.id}`,
        401
      )
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please add a file to upload`, 404));
  }

  const file = req.files.file;

  // make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`File must be an image file`, 400));
  }
  // make sure the file size is not too big
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `File size should be less than ${Math.floor(
          process.env.MAX_FILE_UPLOAD / 1000
        )} Mb`,
        400
      )
    );
  }
  // create custome file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  // save file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return new ErrorResponse(`There was a problem saving the file`, 500);
    }
    await Bootcamp.findByIdAndUpdate(bootcamp._id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: { fileName: file.name },
      msg: { text: `Update photo for a bootcamp id of ${req.params.id}` },
    });
  });
});
