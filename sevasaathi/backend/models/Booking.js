const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    lat: Number,
    lng: Number,
  },
  { _id: false }
);

const BookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    requestedProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    serviceType: {
      type: String,
      required: [true, "Service type is required"],
    },
    bookingDate: {
      type: Date,
    },
    issue: {
      type: String,
      default: "",
    },
    details: {
      type: String,
      default: "",
    },
    location: {
      type: LocationSchema,
      required: true,
    },
    providerLocation: LocationSchema,
    providerName: {
      type: String,
      default: "",
    },
    providerPhone: {
      type: String,
      default: "",
    },
    estimatedArrival: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "on_the_way", "arrived", "completed", "cancelled"],
      default: "pending",
    },
    updates: [
      {
        status: {
          type: String,
          enum: ["pending", "assigned", "on_the_way", "arrived", "completed", "cancelled"],
        },
        message: String,
        location: LocationSchema,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
