const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const productRoutes = require("./routes/product.routes");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use("/api/products", productRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🍰 BakeBuddy backend running perfectly (MVC structure)");
});

module.exports = app;
