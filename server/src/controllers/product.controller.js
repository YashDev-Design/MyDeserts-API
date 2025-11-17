const Product = require("../models/product.model");

// GET all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// POST new product
exports.addProduct = async (req, res) => {
  try {
    const { name, type, calories } = req.body;
    const newProduct = new Product({ name, type, calories });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", data: newProduct });
  } catch (error) {
    res.status(400).json({ message: "Error adding product" });
  }
};

// PUT update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, calories } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, type, calories },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    res.status(400).json({ message: "Error updating product", error });
  }
};

// DELETE product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully", data: deletedProduct });
  } catch (error) {
    res.status(400).json({ message: "Error deleting product", error });
  }
};
