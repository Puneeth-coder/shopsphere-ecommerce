import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/checkout.css";
import "../styles/auth.css";

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const addressData = {
      shippingAddress,
      city,
      postalCode,
    };

    localStorage.setItem(
      "shippingAddress",
      JSON.stringify(addressData)
    );

    alert("Address Saved Successfully!");
    navigate("/payment");
  };

  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  return (
    <div className="checkout-container">
      {/* Progress Tracker */}
      <div className="checkout-steps">
        <div className="step-item active">
          <span className="step-num">1</span> Shipping Details
        </div>
        <div className="step-item">
          <span className="step-num">2</span> Payment Option
        </div>
        <div className="step-item">
          <span className="step-num">3</span> Complete Order
        </div>
      </div>

      <div className="checkout-layout">
        {/* Shipping Form Card */}
        <div className="checkout-card">
          <h2 className="checkout-card-title">Shipping Address</h2>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="ship-address">Street Address</label>
              <input
                id="ship-address"
                className="form-input"
                type="text"
                placeholder="123 Main St, Apartment, Suite..."
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ship-city">City</label>
              <input
                id="ship-city"
                className="form-input"
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ship-zip">Postal / ZIP Code</label>
              <input
                id="ship-zip"
                className="form-input"
                type="text"
                placeholder="Enter 6-digit postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>

            <button className="btn-checkout-action" type="submit" style={{ marginTop: "12px" }}>
              Proceed to Payment Options
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-card" style={{ height: "fit-content" }}>
          <h2 className="checkout-card-title">Order Summary</h2>
          
          <div className="summary-list" style={{ maxHeight: "280px", overflowY: "auto", marginBottom: "16px" }}>
            {cartItems.map((item) => (
              <div key={item._id} className="summary-item">
                <img
                  src={`${serverUrl}${item.image}`}
                  alt={item.name}
                  className="summary-item-img"
                />
                <div className="summary-item-details">
                  <p className="summary-item-name">{item.name}</p>
                  <p className="summary-item-qty-price">
                    {item.qty} × ₹{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pricing-breakdown">
            <div className="pricing-row">
              <span>Items Total</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="pricing-row">
              <span>Standard Delivery</span>
              <span style={{ color: "#16a34a", fontWeight: "600" }}>FREE</span>
            </div>
            <div className="pricing-row grand-total">
              <span>Grand Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;