import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

// Customer: place a new order
router.post("/", protect, createOrder);

// Admin: get all orders
router.get("/", protect, adminOnly, getAllOrders);

// Customer: get logged-in user's orders
router.get("/my", protect, getMyOrders);

// Admin: update order status
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
