// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Enables Cross-Origin Resource Sharing
const dotenv = require("dotenv"); // Loads environment variables from .env file
const Product = require("./models/Product"); // Import Product model

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests (frontend-backend communication)
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected")) // Successful connection
  .catch((err) => console.error(err)); // Connection error handling

// ------------------ ROUTES ------------------

// READ: Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from database
    res.json(products); // Send products as JSON response
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" }); // Handle server errors
  }
});

// CREATE: Add a new product
app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body); // Create new product from request body
    await product.save(); // Save product to database
    res.status(201).json(product); // Return created product with 201 status
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" }); // Handle errors
  }
});

// UPDATE: Edit a product by ID
app.put("/api/products/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
    });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated); // Send updated product
  } catch (err) {
    res.status(500).json({ error: "Update failed" }); // Handle errors
  }
});

// DELETE: Remove a product by ID
app.delete("/api/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id); // Delete product
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" }); // Confirm deletion
  } catch (err) {
    res.status(500).json({ error: "Delete failed" }); // Handle errors
  }
});

// Start the server
