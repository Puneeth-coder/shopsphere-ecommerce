const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      image: {
        type: String,
        required: true,
      },

      category: {
        type: String,
        required: true,
        default: "General",
      },

      stock: {
        type: Number,
        required: true,
        default: 0,
      },

      reviews: [
        {
          name: {
            type: String,
            default: "Customer",
          },

          rating: {
            type: Number,
            required: true,
          },

          comment: {
            type: String,
            required: true,
          },
        },
      ],

      rating: {
        type: Number,
        default: 0,
      },

      numReviews: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Product",
    productSchema
  );