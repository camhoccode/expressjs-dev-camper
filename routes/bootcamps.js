const express = require("express");
const {
  getBootcamps,
  getOneBootcamp,
  postBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsOnRadius,
  uploadPhotoBootcamp,
} = require("../controllers/bootcamps");
const advancedResult = require("../middleware/advancedResult");

// include other resource
const courseRouter = require("./courses");
const reviewRouter = require("./review");
const Bootcamps = require("../models/Bootcamps");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router
  .route("/")
  .get(advancedResult(Bootcamps, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), postBootcamp);
router
  .route("/:id")
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp)
  .get(getOneBootcamp);
router.route("/radius/:zipcode/:distance").get(getBootcampsOnRadius);
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), uploadPhotoBootcamp);

module.exports = router;
