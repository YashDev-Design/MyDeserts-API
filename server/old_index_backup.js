require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const Desert = require("./models/deserts.model");

const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());

// Get values from .env
const { PORT, MONGO_URI } = process.env;

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// GET Route - test API
app.get("/", (req, res) => {
  res.send("🚀 Node server is working perfectly!");
});

// GET Route to show all deserts
app.get("/api/deserts", async (req, res) => {
  try {
    const deserts = await Desert.find();
    res.json(deserts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deserts" });
  }
});

// POST Route to add a new desert
app.post("/api/deserts", async (req, res) => {
  try {
    const { name, type, calories } = req.body;
    const newDesert = new Desert({ name, type, calories });
    await newDesert.save();
    res
      .status(201)
      .json({ message: "Desert added successfully", data: newDesert });
  } catch (error) {
    res.status(400).json({ message: "Error adding desert" });
  }
});

// PUT Route to update a desert by ID
app.put("/api/deserts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, calories } = req.body;

    // Find and update
    const updatedDesert = await Desert.findByIdAndUpdate(
      id,
      { name, type, calories },
      { new: true } // return the updated document
    );

    if (!updatedDesert) {
      return res.status(404).json({ message: "Desert not found" });
    }

    res.json({
      message: "Desert updated successfully",
      data: updatedDesert,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating desert", error });
  }
});

// DELETE Route to remove a desert by ID
app.delete("/api/deserts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDesert = await Desert.findByIdAndDelete(id);

    if (!deletedDesert) {
      return res.status(404).json({ message: "Desert not found" });
    }

    res.json({ message: "Desert deleted successfully", data: deletedDesert });
  } catch (error) {
    res.status(400).json({ message: "Error deleting desert", error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
