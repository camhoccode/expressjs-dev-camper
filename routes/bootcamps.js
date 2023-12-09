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
const Bootcamps = require("../models/Bootcamps");

const router = express.Router();

// re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/")
  .get(advancedResult(Bootcamps, "courses"), getBootcamps)
  .post(postBootcamp);
router
  .route("/:id")
  .put(updateBootcamp)
  .delete(deleteBootcamp)
  .get(getOneBootcamp);
router.route("/radius/:zipcode/:distance").get(getBootcampsOnRadius);
router.route("/:id/photo").put(uploadPhotoBootcamp);

module.exports = router;
