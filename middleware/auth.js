const jwt = require("jsonwebtoken");
const asyncHandlerErr = require("./asyncCatchErr");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// protect routes
exports.protect = asyncHandlerErr(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // set token from header
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    // set token from cookie
    token = req.cookies.token;
  }

  // make sure token
  if (!token) {
    return next(new ErrorResponse(`Not authorized to access this route`, 401));
  }
  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    console.error(error);
  }
});

// grant access to specific roles
exports.authorize = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
