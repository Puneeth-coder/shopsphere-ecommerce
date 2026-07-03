import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCart();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "20px auto",
        padding: "20px",
      }}
    >
      <h1>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p>Cart is Empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "15px",
              }}
            >
              <img
                src={`${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}${item.image}`}
                alt={item.name}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div style={{ flex: 1 }}>
                <h3>{item.name}</h3>

                <p>
                  <strong>₹{item.price}</strong>
                </p>

                <div>
                  <button
                    onClick={() =>
                      decreaseQty(item._id)
                    }
                  >
                    -
                  </button>

                  <span
                    style={{
                      margin: "0 10px",
                    }}
                  >
                    {item.qty}
                  </span>

                  <button
                    onClick={() =>
                      increaseQty(item._id)
                    }
                  >
                    +
                  </button>
                </div>

                <p>
                  Subtotal: ₹
                  {item.price * item.qty}
                </p>

                <button
                  onClick={() =>
                    removeFromCart(item._id)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <hr />

          <h2>
            Total Price: ₹{totalPrice}
          </h2>
          <Link to="/checkout">
            <button>
              Proceed To Checkout
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

export default CartPage;