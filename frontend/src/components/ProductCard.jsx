import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/productCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const isOutOfStock = product.stock <= 0;

  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  return (
    <div className="product-card">
      <div className="product-card-img-wrapper">
        {product.category && (
          <span className="product-card-category">{product.category}</span>
        )}
        <img
          src={`${serverUrl}${product.image}`}
          alt={product.name}
          loading="lazy"
        />
      </div>

      <div className="product-card-content">
        <h3>{product.name}</h3>

        <div className="product-card-meta">
          <span className="product-card-rating">
            ★ {product.rating ? product.rating.toFixed(1) : "0.0"}
          </span>
          <span className="product-card-reviews">
            ({product.numReviews || 0} reviews)
          </span>
        </div>

        <div className="product-card-price-stock">
          <span className="product-card-price">₹{product.price}</span>
          <span className={`product-card-stock ${isOutOfStock ? "out-of-stock" : "in-stock"}`}>
            {isOutOfStock ? "Out of Stock" : `Stock: ${product.stock}`}
          </span>
        </div>

        <div className="product-card-actions">
          <Link
            to={`/product/${product._id}`}
            className="product-card-btn-view"
          >
            Details
          </Link>

          <button
            className="product-card-btn-add"
            disabled={isOutOfStock}
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;