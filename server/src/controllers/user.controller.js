import User from "../models/user.model.js";

// 👥 GET /api/users  (admin only)
// Fetch all users (without passwords)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json(users);
  } catch (err) {
    console.error("getAllUsers error:", err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

// 🗑️ DELETE /api/users/:id  (admin only)
// Delete a user (prevent deleting yourself)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional safety: prevent admin from deleting themselves from here
    if (req.user && req.user.id === id) {
      return res.status(400).json({
        message: "Admins cannot delete their own account from this page",
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

// 🎭 PUT /api/users/:id/role  (admin only)
// Promote/demote between "customer" and "admin"
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // expected "admin" or "customer"

    if (!["admin", "customer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Optional safety: don't let admin remove their own admin role
    if (req.user && req.user.id === id && role !== "admin") {
      return res
        .status(400)
        .json({ message: "You cannot remove your own admin role" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    const safeUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res.json({
      message: "Role updated successfully",
      user: safeUser,
    });
  } catch (err) {
    console.error("updateUserRole error:", err);
    return res.status(500).json({ message: "Failed to update role" });
  }
};