// server/src/controllers/cart.controller.js
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

/**
 * Helper: get or create cart for current user
 */
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [],
    });
  }

  return cart;
}

/**
 * POST /api/cart
 * Body: { productId, quantity }
 * Adds an item to the logged-in user's cart
 */
export async function addToCart(req, res) {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await getOrCreateCart(userId);

    // See if item already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        type: product.type,
        calories: product.calories,
        price: product.price || 0,
        quantity,
      });
    }

    await cart.save();

    return res.status(200).json(cart);
  } catch (err) {
    console.error("Error in addToCart:", err);
    return res.status(500).json({ message: "Failed to add to cart" });
  }
}

/**
 * GET /api/cart
 * Returns current user's cart
 */
export async function getCart(req, res) {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(200).json({ user: userId, items: [] });
    }

    return res.status(200).json(cart);
  } catch (err) {
    console.error("Error in getCart:", err);
    return res.status(500).json({ message: "Failed to fetch cart" });
  }
}

/**
 * DELETE /api/cart/:itemId
 * Removes a single item from cart by its _id
 */
export async function removeFromCart(req, res) {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== itemId.toString()
    );

    await cart.save();

    return res.status(200).json(cart);
  } catch (err) {
    console.error("Error in removeFromCart:", err);
    return res.status(500).json({ message: "Failed to remove item" });
  }
}

/**
 * DELETE /api/cart
 * Clears the entire cart for current user
 */
export async function clearCart(req, res) {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(200).json({ message: "Cart already empty" });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({ message: "Cart cleared", cart });
  } catch (err) {
    console.error("Error in clearCart:", err);
    return res.status(500).json({ message: "Failed to clear cart" });
  }
}