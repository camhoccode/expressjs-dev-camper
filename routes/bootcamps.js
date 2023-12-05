const express = require("express");
const {
  getBootcamps,
  getOneBootcamp,
  postBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require("../controllers/bootcamps");

const router = express.Router();

router.route("/").get(getBootcamps).post(postBootcamp);
router
  .route("/:id")
  .put(updateBootcamp)
  .delete(deleteBootcamp)
  .get(getOneBootcamp);

module.exports = router;
