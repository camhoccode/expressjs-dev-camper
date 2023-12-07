const express = require("express");
const {
  getBootcamps,
  getOneBootcamp,
  postBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsOnRadius,
} = require("../controllers/bootcamps");

const router = express.Router();

router.route("/").get(getBootcamps).post(postBootcamp);
router
  .route("/:id")
  .put(updateBootcamp)
  .delete(deleteBootcamp)
  .get(getOneBootcamp);
router.route("/radius/:zipcode/:distance").get(getBootcampsOnRadius);

module.exports = router;
