const express = require("express");
const Review = require("../models/Reviews");
const advancedResult = require("../middleware/advancedResult");
const {
  getReviews,
  getSingleReview,
  postReview,
  updateReview,
  deleteReview,
} = require("../controllers/review");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResult(Review, { path: "bootcamp", select: "name description" }),
    getReviews
  )
  .post(protect, authorize("user", "publisher", "admin"), postReview);
router
  .route("/:id")
  .get(getSingleReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
