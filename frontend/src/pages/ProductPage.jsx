import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../services/api";
import { useCart } from "../context/CartContext";

import "../styles/productPage.css";

const ProductPage = () => {
const { id } = useParams();

const { addToCart } = useCart();

const [product, setProduct] = useState(null);

const [loading, setLoading] = useState(true);

const [error, setError] = useState("");

const [qty, setQty] = useState(1);

useEffect(() => {
const fetchProduct = async () => {
try {
const response = await api.get(
`/products/${id}`
);

    console.log(
      "Product Response:",
      response.data
    );

    // Backend returns product directly
    setProduct(response.data);

  } catch (error) {
    console.log(error);

    setError("Product not found");
  } finally {
    setLoading(false);
  }
};

fetchProduct();

}, [id]);

if (loading) {
return <h2>Loading...</h2>;
}

if (error) {
return <h2>{error}</h2>;
}

if (!product) {
return <h2>Product Not Found</h2>;
}

return ( <div className="product-page">
{/* Product Image */} <div className="product-image">
<img
src={`http://localhost:5000${product.image}`}
alt={product.name}
/> </div>
  {/* Product Details */}
  <div className="product-info">
    <h1>{product.name}</h1>

    <h2>₹{product.price}</h2>

    <p>
      <strong>Description:</strong>{" "}
      {product.description}
    </p>

    <p>
      <strong>Category:</strong>{" "}
      {product.category}
    </p>

    <p>
      <strong>Stock:</strong>{" "}
      {product.stock}
    </p>

    <p>
      <strong>Rating:</strong>{" "}
      ⭐ {product.rating || 0}
    </p>

    <p>
      <strong>Reviews:</strong>{" "}
      {product.numReviews || 0}
    </p>

    {/* Quantity Selector */}
    {product.stock > 0 && (
      <div className="quantity-box">
        <label>
          Quantity:
        </label>

        <select
          value={qty}
          onChange={(e) =>
            setQty(
              Number(
                e.target.value
              )
            )
          }
        >
          {[...Array(product.stock).keys()].map(
            (x) => (
              <option
                key={x + 1}
                value={x + 1}
              >
                {x + 1}
              </option>
            )
          )}
        </select>
      </div>
    )}

    {/* Add To Cart */}
    <button
      disabled={product.stock === 0}
      onClick={() =>
        addToCart(
          product,
          qty
        )
      }
    >
      {product.stock === 0
        ? "Out Of Stock"
        : "Add To Cart"}
    </button>

    <hr />

    {/* Reviews */}
    <h3>Reviews</h3>

    {product.reviews &&
    product.reviews.length > 0 ? (
      product.reviews.map(
        (
          review,
          index
        ) => (
          <div key={index}>
            <strong>
              {review.name}
            </strong>

            <p>
              ⭐ {review.rating}
            </p>

            <p>
              {review.comment}
            </p>

            <hr />
          </div>
        )
      )
    ) : (
      <p>
        No Reviews Yet
      </p>
    )}
  </div>
</div>

);
};

export default ProductPage;
