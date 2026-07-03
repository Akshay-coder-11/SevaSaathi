const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
} = require("../controllers/bookingController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createBooking);
router.get("/my-requests", verifyToken, getMyBookings);
router.get("/", verifyToken, authorizeRoles("admin"), getAllBookings);
router.get("/:id", verifyToken, getBookingById);
router.put(
  "/:id/status",
  verifyToken,
  authorizeRoles("admin", "provider"),
  updateBookingStatus
);

module.exports = router;
