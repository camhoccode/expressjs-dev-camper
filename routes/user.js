const express = require("express");
const {
  getUsers,
  getSingleUser,
  deleteUser,
  createUser,
  updateUser,
} = require("../controllers/user");
const { protect, authorize } = require("../middleware/auth");
const advancedResult = require("../middleware/advancedResult");
const User = require("../models/User");

const router = express.Router();
router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResult(User), getUsers).post(createUser);
router.route("/:id").get(getSingleUser).put(updateUser).delete(deleteUser);

module.exports = router;
