const crypto = require("crypto");
const User = require("../models/User");
const Booking = require("../models/Booking");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const { sendTokenResponse } = require("../utils/generateToken");

// @desc    Register a new user (customer or provider)
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password, role, providerDescription, providerExperience, providerCompany, servicesOffered } = req.body;

  if (!name || !email || !phone || !password) {
    return next(new ErrorResponse("Please provide all required fields", 400));
  }

  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    return next(
      new ErrorResponse("User already exists with this email or phone", 400)
    );
  }

  const userFields = {
    name,
    email,
    phone,
    password,
    role:
      role === "admin"
        ? "admin"
        : role === "provider"
        ? "provider"
        : "customer",
  };

  if (userFields.role === "provider") {
    userFields.providerDescription = providerDescription || "";
    userFields.providerExperience = providerExperience || "";
    userFields.providerCompany = providerCompany || "";
    userFields.servicesOffered = Array.isArray(servicesOffered)
      ? servicesOffered.filter(Boolean)
      : typeof servicesOffered === "string"
      ? servicesOffered.split(",").map((item) => item.trim()).filter(Boolean)
      : [];
  }

  const user = await User.create(userFields);

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  if (!user.isActive) {
    return next(new ErrorResponse("Account has been suspended", 403));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// @desc    Get currently logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

// @desc    Update current user / provider profile
// @route   PUT /api/auth/me
// @access  Private
exports.updateMe = asyncHandler(async (req, res, next) => {
  const {
    name,
    phone,
    profileImage,
    providerDescription,
    providerExperience,
    providerCompany,
    servicesOffered,
  } = req.body;

  const updateFields = {
    name,
    phone,
    profileImage,
  };

  if (req.user.role === "provider") {
    updateFields.providerDescription = providerDescription;
    updateFields.providerExperience = providerExperience;
    updateFields.providerCompany = providerCompany;
    if (servicesOffered !== undefined) {
      updateFields.servicesOffered = Array.isArray(servicesOffered)
        ? servicesOffered.filter(Boolean)
        : typeof servicesOffered === "string"
        ? servicesOffered.split(",").map((item) => item.trim()).filter(Boolean)
        : [];
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, user });
});

// @desc    Get admin dashboard stats
// @route   GET /api/auth/stats
// @access  Private/Admin
exports.getAdminStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const customerCount = await User.countDocuments({ role: "customer" });
  const providerCount = await User.countDocuments({ role: "provider" });
  const totalBookings = await Booking.countDocuments();
  const pendingBookings = await Booking.countDocuments({ status: "pending" });
  const assignedBookings = await Booking.countDocuments({ status: "assigned" });
  const onTheWayBookings = await Booking.countDocuments({ status: "on_the_way" });
  const arrivedBookings = await Booking.countDocuments({ status: "arrived" });
  const completedBookings = await Booking.countDocuments({ status: "completed" });
  const cancelledBookings = await Booking.countDocuments({ status: "cancelled" });

  res.status(200).json({
    success: true,
    totalUsers,
    customerCount,
    providerCount,
    totalBookings,
    statusCounts: {
      pending: pendingBookings,
      assigned: assignedBookings,
      on_the_way: onTheWayBookings,
      arrived: arrivedBookings,
      completed: completedBookings,
      cancelled: cancelledBookings,
    },
  });
});

// @desc    Get total registered users
// @route   GET /api/auth/users/count
// @access  Private/Admin
exports.getRegisteredUserCount = asyncHandler(async (req, res, next) => {
  const count = await User.countDocuments();
  res.status(200).json({ success: true, count });
});

// @desc    Get all registered users, visible only to admin
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find()
    .select("-password -resetPasswordToken -resetPasswordExpire")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, users });
});

// @desc    Search providers by name or service
// @route   GET /api/providers
// @access  Public
exports.getProviders = asyncHandler(async (req, res, next) => {
  const { search, service } = req.query;

  const query = { role: "provider", isActive: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { providerCompany: { $regex: search, $options: "i" } },
      { providerDescription: { $regex: search, $options: "i" } },
    ];
  }

  if (service) {
    query.servicesOffered = { $regex: service, $options: "i" };
  }

  const providers = await User.find(query)
    .select("name profileImage servicesOffered providerDescription providerExperience providerCompany createdAt")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, providers });
});

// @desc    Get provider details by ID
// @route   GET /api/providers/:id
// @access  Public
exports.getProviderById = asyncHandler(async (req, res, next) => {
  const provider = await User.findOne({ _id: req.params.id, role: "provider", isActive: true })
    .select("name profileImage servicesOffered providerDescription providerExperience providerCompany createdAt");

  if (!provider) {
    return next(new ErrorResponse("Provider not found", 404));
  }

  res.status(200).json({ success: true, provider });
});

// @desc    Get a single user detail by ID
// @route   GET /api/auth/users/:id
// @access  Private/Admin
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select(
    "-password -resetPasswordToken -resetPasswordExpire"
  );

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({ success: true, user });
});

// @desc    Forgot password - sends reset link via email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("No user found with that email", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const message = `
    <h3>Password Reset Request</h3>
    <p>You requested a password reset for your SevaSaathi account.</p>
    <p>Click the link below to reset your password (valid for 30 minutes):</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: "SevaSaathi - Password Reset Request",
      html: message,
    });

    res.status(200).json({ success: true, message: "Reset email sent" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc    Reset password using token from email
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid or expired reset token", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});
