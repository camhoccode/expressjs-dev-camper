const advancedResult = require("../middleware/advancedResult");
const asyncHandlerErr = require("../middleware/asyncCatchErr");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// @desc get all users
// @route get /api/v1/users
// @access private/admin
exports.getUsers = asyncHandlerErr(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
});

// @desc get single user
// @route get /api/v1/users/:id
// @access private/admin
exports.getSingleUser = asyncHandlerErr(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ success: true, data: user });
});

// @desc create user
// @route post /api/v1/users
// @access private/admin
exports.createUser = asyncHandlerErr(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

// @desc update user
// @route put /api/v1/users/:id
// @access private/admin
exports.updateUser = asyncHandlerErr(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({ success: true, data: user });
});

// @desc delete user
// @route put /api/v1/users/:id
// @access private/admin
exports.deleteUser = asyncHandlerErr(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(201).json({ success: true, data: {} });
});
