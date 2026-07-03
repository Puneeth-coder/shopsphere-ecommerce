const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  createReview,
} = require(
  "../controllers/productController"
);

// Get all products
router.get(
  "/",
  getProducts
);

// Get single product
router.get(
  "/:id",
  getProductById
);

// Create product
router.post(
  "/",
  createProduct
);

// Delete product
router.delete(
  "/:id",
  deleteProduct
);

// Add review
router.post(
  "/:id/reviews",
  createReview
);

module.exports = router;