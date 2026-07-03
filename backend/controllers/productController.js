const Product = require(
  "../models/productModel"
);

const getProducts = async (req, res) => {
  try {
    const pageSize = 8;
    const page = Number(req.query.page) || 1;

    const query = {};

    if (req.query.keyword) {
      query.name = {
        $regex: req.query.keyword,
        $options: "i",
      };
    }

    if (req.query.category && req.query.category !== "All") {
      query.category = req.query.category;
    }

    let sortOptions = {};
    if (req.query.sort === "priceAsc") {
      sortOptions = { price: 1 };
    } else if (req.query.sort === "priceDesc") {
      sortOptions = { price: -1 };
    } else if (req.query.sort === "ratingDesc") {
      sortOptions = { rating: -1 };
    } else {
      sortOptions = { createdAt: -1 };
    }

    const count = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    const categories = await Product.distinct("category");

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      categories: ["All", ...categories],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Product
const getProductById =
  async (req, res) => {
    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "Product not found",
          });
      }

      res.json(product);

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

// Create Product
const createProduct =
  async (req, res) => {
    try {

      const {
        name,
        description,
        price,
        image,
        category,
        stock,
      } = req.body;

      const product =
        await Product.create({
          name,
          description,
          price,
          image,
          category,
          stock,
        });

      res.status(201).json({
        success: true,
        product,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

// Delete Product
const deleteProduct =
  async (req, res) => {
    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "Product not found",
          });
      }

      await Product.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
        message:
          "Product deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

// Create Review
const createReview =
  async (req, res) => {
    try {

      const {
        rating,
        comment,
      } = req.body;

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res
          .status(404)
          .json({
            success: false,
            message:
              "Product not found",
          });
      }

      const review = {
        name: "Customer",
        rating:
          Number(rating),
        comment,
      };

      product.reviews.push(
        review
      );

      product.numReviews =
        product.reviews.length;

      product.rating =
        product.reviews.reduce(
          (acc, item) =>
            acc +
            item.rating,
          0
        ) /
        product.reviews.length;

      await product.save();

      res.status(201).json({
        success: true,
        message:
          "Review added successfully",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  createReview,
};