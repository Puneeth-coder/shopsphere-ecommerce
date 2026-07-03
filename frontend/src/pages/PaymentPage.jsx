import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/checkout.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem("paymentMethod", paymentMethod);
    alert("Payment Method Saved Successfully!");
    navigate("/placeorder");
  };

  return (
    <div className="checkout-container">
      {/* Progress Tracker */}
      <div className="checkout-steps">
        <div className="step-item completed">
          <span className="step-num">1</span> Shipping Details
        </div>
        <div className="step-item active">
          <span className="step-num">2</span> Payment Option
        </div>
        <div className="step-item">
          <span className="step-num">3</span> Complete Order
        </div>
      </div>

      <div className="checkout-card" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2 className="checkout-card-title">Select Payment Method</h2>
        <form onSubmit={submitHandler}>
          <div className="payment-methods-grid">
            {/* Cash on Delivery */}
            <div 
              className={`payment-method-card ${paymentMethod === "COD" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("COD")}
            >
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              <label htmlFor="cod" className="payment-method-label">
                Cash On Delivery (COD)
                <span className="payment-method-desc">Pay with cash when your products are delivered.</span>
              </label>
            </div>

            {/* UPI Test Gateway */}
            <div 
              className={`payment-method-card ${paymentMethod === "UPI" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("UPI")}
            >
              <input
                type="radio"
                id="upi"
                name="paymentMethod"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={() => setPaymentMethod("UPI")}
              />
              <label htmlFor="upi" className="payment-method-label">
                UPI / Net Banking (Razorpay)
                <span className="payment-method-desc">Pay instantly using GPay, PhonePe, Paytm, or Net Banking.</span>
              </label>
            </div>

            {/* Credit/Debit Card */}
            <div 
              className={`payment-method-card ${paymentMethod === "Card" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("Card")}
            >
              <input
                type="radio"
                id="card"
                name="paymentMethod"
                value="Card"
                checked={paymentMethod === "Card"}
                onChange={() => setPaymentMethod("Card")}
              />
              <label htmlFor="card" className="payment-method-label">
                Debit / Credit Card (Razorpay)
                <span className="payment-method-desc">Secure checkout via Visa, Mastercard, RuPay, or AMEX.</span>
              </label>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
            <button className="btn-checkout-action" type="submit" style={{ flex: 1 }}>
              Save & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;