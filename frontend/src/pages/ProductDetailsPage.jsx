import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import api from "../services/api";

import { useCart } from "../context/CartContext";

const ProductDetailsPage = () => {
  const { id } = useParams();

  const { addToCart } =
    useCart();

  const [product,
    setProduct] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    const fetchProduct =
      async () => {

        try {

          console.log(
            "Product ID:",
            id
          );

          const response =
            await api.get(
              `/products/${id}`
            );

          console.log(
            "API Response:",
            response.data
          );

          if (
            response.data.product
          ) {

            setProduct(
              response.data.product
            );

          } else {

            setProduct(
              response.data
            );

          }

        } catch (error) {

          console.log(
            "API Error:",
            error
          );

        } finally {

          setLoading(false);

        }
      };

    fetchProduct();

  }, [id]);

  if (loading) {

    return (
      <h2>
        Loading Product...
      </h2>
    );

  }

  if (!product) {

    return (
      <h2>
        Product Not Found
      </h2>
    );

  }

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <h2>
        Debug Product Data
      </h2>

      <pre>
        {JSON.stringify(
          product,
          null,
          2
        )}
      </pre>

      {product.image && (
        <img
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
          width="300"
        />
      )}

      <h1>
        {product.name}
      </h1>

      <p>
        {product.description}
      </p>

      <h2>
        ₹{product.price}
      </h2>

      <button
        onClick={() =>
          addToCart(product)
        }
      >
        Add To Cart
      </button>
    </div>
  );
};

export default ProductDetailsPage;