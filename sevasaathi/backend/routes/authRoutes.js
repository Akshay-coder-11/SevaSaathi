const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateMe,
  getAdminStats,
  getRegisteredUserCount,
  getAllUsers,
  getUserById,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, updateMe);
router.get("/stats", verifyToken, authorizeRoles("admin"), getAdminStats);
router.get("/users", verifyToken, authorizeRoles("admin"), getAllUsers);
router.get("/users/count", verifyToken, authorizeRoles("admin"), getRegisteredUserCount);
router.get("/users/:id", verifyToken, authorizeRoles("admin"), getUserById);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

module.exports = router;
