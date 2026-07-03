const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// verifyToken: checks for a valid JWT in the Authorization header or cookie,
// then attaches the logged-in user to req.user.
const verifyToken = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized, no token provided", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse("User no longer exists", 401));
    }

    if (!req.user.isActive) {
      return next(new ErrorResponse("Account has been suspended", 403));
    }

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized, token invalid", 401));
  }
});

// authorizeRoles: restricts a route to specific roles, e.g. authorizeRoles("admin")
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
