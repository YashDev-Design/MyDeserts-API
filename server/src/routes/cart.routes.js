// server/src/routes/cart.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

// Add item to cart
router.post("/", protect, addToCart);

// Get current user's cart
router.get("/", protect, getCart);

// Remove single item from cart by its cart item _id
router.delete("/:itemId", protect, removeFromCart);

// Clear entire cart for current user
router.delete("/", protect, clearCart);

export default router;