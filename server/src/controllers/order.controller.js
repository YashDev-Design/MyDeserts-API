import Order from "../models/order.model.js";

// Create a new order (customer)
export const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id; // comes from protect middleware
    const { items } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    // calculate total items
    const totalItems = items.reduce((sum, item) => {
      const qty = Number(item.quantity) || 1;
      return sum + qty;
    }, 0);

    const order = new Order({
      user: userId,
      items: items.map((i) => ({
        product: i.product,
        name: i.name,
        type: i.type,
        calories: i.calories,
        quantity: i.quantity || 1,
      })),
      totalItems,
    });

    const saved = await order.save();

    return res.status(201).json({
      message: "Order created successfully",
      order: saved,
    });
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ message: "Failed to create order" });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (err) {
    console.error("getAllOrders error:", err);
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get orders of logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    return res.json(orders);
  } catch (err) {
    console.error("getMyOrders error:", err);
    return res.status(500).json({ message: "Failed to fetch your orders" });
  }
};

// 🔄 Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "preparing",
      "ready",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Order.findByIdAndUpdate(id, { status }, { new: true })
      .populate("user", "username email")
      .exec();

    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({
      message: "Order status updated",
      order: updated,
    });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    return res.status(500).json({ message: "Failed to update order status" });
  }
};
