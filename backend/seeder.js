const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/productModel");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

const sampleProducts = [
  {
    name: "iPhone 16 Pro Max",
    description: "The latest Apple iPhone 16 Pro Max with A18 Pro chip, titanium design, and upgraded camera controls.",
    price: 139900,
    image: "/uploads/iphone16pro.avif",
    category: "Smartphones",
    stock: 12,
    rating: 4.8,
    numReviews: 24,
  },
  {
    name: "Samsung Galaxy S26 Ultra",
    description: "Experience the next level of Galaxy AI with 200MP camera, built-in S-Pen, and stunning dynamic display.",
    price: 124999,
    image: "/uploads/samsung-s26-ultra.webp",
    category: "Smartphones",
    stock: 8,
    rating: 4.7,
    numReviews: 18,
  },
  {
    name: "MacBook Pro M4 Max",
    description: "Supercharged M4 Max processor with 16-core CPU, 40-core GPU, up to 128GB unified memory and liquid retina XDR screen.",
    price: 249900,
    image: "/uploads/macbook-pro.png",
    category: "Laptops",
    stock: 5,
    rating: 4.9,
    numReviews: 15,
  },
  {
    name: "Dell XPS 15 OLED",
    description: "Stunning 3.5K OLED touchscreen display, Intel Core i9, 32GB RAM, 1TB SSD, and NVIDIA RTX graphics card.",
    price: 189000,
    image: "/uploads/DELL-XPS-15.avif",
    category: "Laptops",
    stock: 4,
    rating: 4.6,
    numReviews: 9,
  },
  {
    name: "iPhone 15 Pro",
    description: "Aerospace-grade titanium design, Action button, A17 Pro chip, and a powerful 3x Telephoto camera system.",
    price: 109900,
    image: "/uploads/iphone15pro.webp",
    category: "Smartphones",
    stock: 0, // Mark out of stock to test stock handling!
    rating: 4.5,
    numReviews: 32,
  },
  {
    name: "Samsung Galaxy S25+",
    description: "Stellar performance, gorgeous 120Hz AMOLED panel, and long-lasting 4900mAh battery life.",
    price: 84999,
    image: "/uploads/SAMSUNG-S25.avif",
    category: "Smartphones",
    stock: 15,
    rating: 4.4,
    numReviews: 14,
  }
];

const seedData = async () => {
  try {
    // Connect to DB
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log("🔌 Connected to database for seeding...");

    // Clear existing products
    await Product.deleteMany();
    console.log("🗑️ Cleared existing products from DB.");

    // Seed new products
    await Product.insertMany(sampleProducts);
    console.log("📦 Sample products successfully seeded!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedData();
