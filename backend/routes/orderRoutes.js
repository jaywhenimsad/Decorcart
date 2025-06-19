const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getOrderById,
  getOrdersByUser,
  createRazorpayOrder,
  verifyPayment, // Make sure this is imported from your controller
  updateOrderStatus,
  getAllOrders,
  deleteOrder,
  cancelOrder
} = require("../controllers/orderController");
const { verifyToken } = require("../middleware/authMiddleware");

// Razorpay Payment Routes
router.post("/razorpay-order", createRazorpayOrder); // Create order
router.post("/verify-payment", verifyPayment); // Verify payment - ADD THIS LINE

// Order Management Routes
router.post("/", placeOrder); // COD orders
router.get("/all", getAllOrders); // Admin view
router.get("/user/:userId", getOrdersByUser); // User's orders
router.get("/:id", getOrderById); // Order details
router.put("/update/:id", updateOrderStatus); // Update status
router.delete("/:id", deleteOrder); // Delete order
// Add this to your orderRoutes.js
router.patch("/:id/cancel", verifyToken, cancelOrder);
// router.patch("/:id/cancel", verifyToken, cancelOrder); // Optional cancel route

module.exports = router;