import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import api from "../services/api";
import { useCart } from "../context/CartContext";
import "../styles/productDetails.css";
import Loader from "../components/Loader";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      if (response.data.product) {
        setProduct(response.data.product);
      } else {
        setProduct(response.data);
      }
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");
    setReviewLoading(true);

    try {
      await api.post(`/products/${id}/reviews`, {
        rating: Number(rating),
        comment,
      });

      setReviewSuccess("Review submitted successfully!");
      setComment("");
      setRating(5);
      // Reload product details to fetch new review
      fetchProduct();
    } catch (err) {
      console.error(err);
      setReviewError(
        err.response?.data?.message || "Failed to submit review. Try again."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Fetching product specifications..." />;
  }

  if (!product) {
    return (
      <div className="details-container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Product Not Found</h2>
        <p style={{ marginTop: "12px", color: "var(--text-muted)" }}>
          The item you are searching for does not exist or has been removed.
        </p>
        <Link to="/" className="btn-primary" style={{ display: "inline-block", marginTop: "20px", textDecoration: "none", padding: "12px 24px" }}>
          Back to Homepage
        </Link>
      </div>
    );
  }

  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="details-container">
      {/* Breadcrumb path */}
      <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "20px" }}>
        <Link to="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
        {" / "}
        <span style={{ color: "var(--primary-dark)", fontWeight: "600" }}>{product.category || "Product Details"}</span>
      </p>

      <div className="details-layout">
        {/* Left Side: Product Image Display Card */}
        <div className="details-image-card">
          {product.image && (
            <img
              src={`${serverUrl}${product.image}`}
              alt={product.name}
              className="details-image"
            />
          )}
        </div>

        {/* Right Side: Product Details & Purchase Card */}
        <div className="details-info">
          <span className="details-category">{product.category || "General"}</span>
          <h1 className="details-name">{product.name}</h1>

          {/* Ratings & Reviews */}
          <div className="details-ratings">
            <span className="details-stars">
              ★ {product.rating ? product.rating.toFixed(1) : "0.0"}
            </span>
            <span className="details-reviews-count">
              ({product.numReviews || 0} customer reviews)
            </span>
          </div>

          {/* Price & Stock status card */}
          <div className="details-price-card">
            <div className="details-price-row">
              <span className="details-price-label">Deal Price:</span>
              <span className="details-price-val">₹{product.price}</span>
            </div>

            <div className="details-price-row" style={{ margin: "0", borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
              <span className="details-price-label">Availability:</span>
              <span className={`details-stock-badge ${isOutOfStock ? "details-stock-out" : "details-stock-in"}`}>
                {isOutOfStock ? "Out of Stock" : `In Stock (Only ${product.stock} units left)`}
              </span>
            </div>
          </div>

          {/* Description */}
          <h3 className="details-description-title">Product Overview</h3>
          <p className="details-description-text">{product.description}</p>

          {/* Purchase button */}
          <button
            className="btn-details-add"
            disabled={isOutOfStock}
            onClick={() => {
              addToCart(product);
              alert(`${product.name} added to cart!`);
            }}
          >
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2 className="reviews-title">Customer Reviews & Feedback</h2>
        <div className="reviews-grid">
          {/* Left: Reviews List */}
          <div>
            {product.reviews && product.reviews.length > 0 ? (
              <div className="reviews-list">
                {product.reviews.map((rev) => (
                  <div key={rev._id} className="review-card">
                    <div className="review-header">
                      <span className="review-user">{rev.name || "Verified Customer"}</span>
                      <span className="review-rating">
                        {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                      </span>
                    </div>
                    <p className="review-comment">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                No reviews have been written for this product yet. Be the first to share your experience!
              </p>
            )}
          </div>

          {/* Right: Write Review Form Card */}
          <div className="review-form-card">
            <h3 className="review-form-title">Write a Review</h3>
            {reviewSuccess && <div className="auth-success" style={{ marginBottom: "16px" }}>{reviewSuccess}</div>}
            {reviewError && <div className="auth-error" style={{ marginBottom: "16px" }}>{reviewError}</div>}
            <form onSubmit={submitReviewHandler}>
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label className="form-label" htmlFor="review-rating">Rating</label>
                <select
                  id="review-rating"
                  className="form-input"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  required
                >
                  <option value="5">5 ★ - Excellent Product</option>
                  <option value="4">4 ★ - Very Good Quality</option>
                  <option value="3">3 ★ - Average/Standard</option>
                  <option value="2">2 ★ - Below Expectations</option>
                  <option value="1">1 ★ - Poor Experience</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label className="form-label" htmlFor="review-comment">Review Description</label>
                <textarea
                  id="review-comment"
                  className="form-input"
                  style={{ minHeight: "100px", resize: "vertical" }}
                  placeholder="Share details of your experience with this item..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>

              <button className="btn-primary" type="submit" disabled={reviewLoading} style={{ width: "100%" }}>
                {reviewLoading ? "Submitting Review..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;