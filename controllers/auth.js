const asyncHandlerErr = require("../middleware/asyncCatchErr");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// @desc register user
// @route post /api/v1/auth/register
// @access public
exports.registerUser = asyncHandlerErr(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // create user
  const user = await User.create({ name, email, password, role });

  sendTokenResponse(user, 200, res);
});

// @desc login user
// @route post /api/v1/auth/login
// @access public
exports.loginUser = asyncHandlerErr(async (req, res, next) => {
  const { email, password } = req.body;

  // validate email and password
  if (!email || !password) {
    return next(new ErrorResponse`Please provide an email and password`(), 400);
  }

  // check user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  // check if password matchs
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }
  sendTokenResponse(user, 200, res);
});

// @desc get current login user
// @route get /api/v1/auth/me
// @access private
exports.getMe = asyncHandlerErr(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});

// @desc logout user / clear cookies
// @route get /api/v1/auth/logout
// @access private
exports.logout = asyncHandlerErr(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
});

// @desc update user password
// @route get /api/v1/auth/updatepassword
// @access private
exports.updatePassword = asyncHandlerErr(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.matchPassword(currentPassword))) {
    return next(new ErrorResponse(`Invalid current password for user`, 401));
  }
  user.password = newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// @desc update user detail
// @route put /api/v1/auth/updatedetails
// @access private
exports.updateDetails = asyncHandlerErr(async (req, res, next) => {
  const fieldToUpdate = {
    name: req.body.name,
    emal: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

// @desc forgot password
// @route post /api/v1/auth/forgotpassword
// @access public
exports.forgotPassword = asyncHandlerErr(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  // get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  //   console.log(resetToken);
  // create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl} `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset",
      message,
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse(`Email could not be sent`, 500));
  }
});

// @desc reset password
// @route Put /api/v1/auth/resetpassword/:resettoken
// @access public
exports.resetPassword = asyncHandlerErr(async (req, res, next) => {
  // get hash token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpired: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse(`Invalid reset password token`, 400));
  }
  // set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpired = undefined;

  await user.save();
  sendTokenResponse(user, 200, res);
});

// get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRED * 24 * 3600 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
