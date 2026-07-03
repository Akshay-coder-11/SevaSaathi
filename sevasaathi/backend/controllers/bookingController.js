const Booking = require("../models/Booking");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Create a new customer booking request
// @route   POST /api/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  const { serviceType, issue, details, location, providerId, bookingDate } = req.body;

  if (!serviceType || !location) {
    return next(new ErrorResponse("Service type and location are required", 400));
  }

  if (providerId) {
    const provider = await require("../models/User").findOne({
      _id: providerId,
      role: "provider",
      isActive: true,
    });

    if (!provider) {
      return next(new ErrorResponse("Selected provider is not available", 400));
    }
  }

  const booking = await Booking.create({
    customer: req.user.id,
    requestedProvider: providerId,
    serviceType,
    bookingDate: bookingDate ? new Date(bookingDate) : undefined,
    issue,
    details,
    location,
    status: "pending",
    updates: [
      {
        status: "pending",
        message: "Request received and waiting for provider assignment",
      },
    ],
  });

  res.status(201).json({ success: true, booking });
});

// @desc    Get bookings for logged-in customer
// @route   GET /api/bookings/my-requests
// @access  Private
exports.getMyBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ customer: req.user.id })
    .populate("provider", "name phone profileImage")
    .populate("requestedProvider", "name profileImage servicesOffered providerDescription providerExperience providerCompany");
  res.status(200).json({ success: true, bookings });
});

// @desc    Get all bookings for admin
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find().populate("provider", "name phone profileImage").populate("customer", "name email phone");
  res.status(200).json({ success: true, bookings });
});

// @desc    Get a single booking details for customer
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate("provider", "name phone profileImage")
    .populate("requestedProvider", "name profileImage servicesOffered providerDescription providerExperience providerCompany");

  if (!booking) {
    return next(new ErrorResponse("Booking not found", 404));
  }

  if (booking.customer.toString() !== req.user.id.toString()) {
    return next(new ErrorResponse("Not authorized to view this booking", 403));
  }

  res.status(200).json({ success: true, booking });
});

// @desc    Update booking status / provider details
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin|Provider
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse("Booking not found", 404));
  }

  if (
    booking.customer.toString() !== req.user.id.toString() &&
    req.user.role !== "admin" &&
    req.user.role !== "provider"
  ) {
    return next(new ErrorResponse("Not authorized to update booking", 403));
  }

  const {
    status,
    providerName,
    providerPhone,
    providerLocation,
    estimatedArrival,
    message,
  } = req.body;

  if (status) booking.status = status;
  if (providerName) booking.providerName = providerName;
  if (providerPhone) booking.providerPhone = providerPhone;
  if (providerLocation) booking.providerLocation = providerLocation;
  if (estimatedArrival) booking.estimatedArrival = estimatedArrival;

  if (status || message || providerLocation) {
    booking.updates.push({
      status: status || booking.status,
      message: message || "Booking status updated",
      location: providerLocation,
    });
  }

  await booking.save();

  res.status(200).json({ success: true, booking });
});
