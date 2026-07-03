const express = require("express");
const dotenv = require("dotenv");

// Load Environment Variables
dotenv.config();

const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Static Upload Folder
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// Test Route
app.get("/", (req, res) => {
  res.send(
    "ShopSphere API Running..."
  );
});

// Routes
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/upload",
  uploadRoutes
);

app.use(
  "/api/payment",
  paymentRoutes
);

// Error Middleware
app.use(errorMiddleware);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});