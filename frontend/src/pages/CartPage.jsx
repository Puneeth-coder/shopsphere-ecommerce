import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "../styles/cart.css";

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

  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <h3>Your cart is empty</h3>
          <p style={{ marginTop: "8px" }}>Add some items from our collection to get started!</p>
          <Link to="/" className="btn-checkout" style={{ display: "inline-block", marginTop: "16px", textDecoration: "none" }}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={`${serverUrl}${item.image}`}
                alt={item.name}
                className="cart-item-img"
              />

              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>

                <p className="cart-item-price">₹{item.price}</p>

                <div className="qty-control">
                  <button
                    className="btn-qty"
                    onClick={() => decreaseQty(item._id)}
                  >
                    -
                  </button>

                  <span className="qty-val">{item.qty}</span>

                  <button
                    className="btn-qty"
                    onClick={() => increaseQty(item._id)}
                  >
                    +
                  </button>
                </div>

                <p className="cart-item-subtotal">
                  Subtotal: <strong>₹{item.price * item.qty}</strong>
                </p>

                <button
                  className="btn-remove"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove Item
                </button>
              </div>
            </div>
          ))}

          <div className="cart-summary">
            <h2 className="cart-total-price">
              Total Price: ₹{totalPrice}
            </h2>
            <Link to="/checkout" style={{ textDecoration: "none" }}>
              <button className="btn-checkout">
                Proceed To Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;