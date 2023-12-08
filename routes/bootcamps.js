const express = require("express");
const {
  getBootcamps,
  getOneBootcamp,
  postBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsOnRadius,
} = require("../controllers/bootcamps");

// include other resource
const courseRouter = require("./courses");

const router = express.Router();

// re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);

router.route("/").get(getBootcamps).post(postBootcamp);
router
  .route("/:id")
  .put(updateBootcamp)
  .delete(deleteBootcamp)
  .get(getOneBootcamp);
router.route("/radius/:zipcode/:distance").get(getBootcampsOnRadius);
// router.route("/bootcamps/:bootcampId/courses").get(getCourses);

module.exports = router;
