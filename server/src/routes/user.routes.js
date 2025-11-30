import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../controllers/user.controller.js";

const router = express.Router();

// All user routes are protected + admin-only
router.use(protect, adminOnly);

// GET /api/users        → list all users
router.get("/", getAllUsers);

// DELETE /api/users/:id → delete a user
router.delete("/:id", deleteUser);

// PUT /api/users/:id/role → update user role (admin/customer)
router.put("/:id/role", updateUserRole);

export default router;