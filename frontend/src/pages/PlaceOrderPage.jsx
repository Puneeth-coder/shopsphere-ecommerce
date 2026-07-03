import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import "../styles/checkout.css";

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const shippingAddress =
    JSON.parse(localStorage.getItem("shippingAddress")) || {};

  const paymentMethod = localStorage.getItem("paymentMethod") || "COD";

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const placeOrderHandler = async () => {
    // If COD, place order immediately
    if (paymentMethod === "COD") {
      try {
        await api.post("/orders", {
          orderItems: cartItems,
          shippingAddress: {
            address: shippingAddress.shippingAddress,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
          },
          paymentMethod,
          totalPrice,
        });

        alert("Order Placed Successfully (Cash on Delivery)!");
        clearCart();
        navigate("/orders");
      } catch (error) {
        console.error("COD Order placement failed:", error);
        alert("Failed To Place Order");
      }
      return;
    }

    // For Card or UPI payments, use Razorpay Gateway
    try {
      // 1. Create Razorpay order ID on backend
      const { data } = await api.post("/payment/razorpay-order", {
        amount: totalPrice,
      });

      const razorpayOrder = data.order;

      // 2. Define Razorpay checkout options
      const options = {
        key: "rzp_test_T93lKVhIu6Cvte", // Razorpay Key ID
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "ShopSphere",
        description: "Payment for order",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // Payment success handler - place the final order
            await api.post("/orders", {
              orderItems: cartItems,
              shippingAddress: {
                address: shippingAddress.shippingAddress,
                city: shippingAddress.city,
                postalCode: shippingAddress.postalCode,
              },
              paymentMethod,
              totalPrice,
              isPaid: true,
              paidAt: new Date(),
              paymentId: response.razorpay_payment_id,
            });

            alert("Payment Successful & Order Placed!");
            clearCart();
            navigate("/orders");
          } catch (err) {
            console.error("Order completion failed after payment:", err);
            alert("Payment completed, but failed to record order in database.");
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
        },
        theme: {
          color: "#f97316", // Accent Orange
        },
        modal: {
          ondismiss: function () {
            alert("Payment transaction was cancelled.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Razorpay workflow failed:", error);
      alert(error.response?.data?.message || "Failed to initiate online payment.");
    }
  };

  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  return (
    <div className="checkout-container">
      {/* Progress Tracker */}
      <div className="checkout-steps">
        <div className="step-item completed">
          <span className="step-num">1</span> Shipping Details
        </div>
        <div className="step-item completed">
          <span className="step-num">2</span> Payment Option
        </div>
        <div className="step-item active">
          <span className="step-num">3</span> Complete Order
        </div>
      </div>

      <div className="checkout-layout">
        {/* Left Side: Order Info Detail Cards */}
        <div>
          {/* Shipping Review */}
          <div className="checkout-card">
            <h2 className="checkout-card-title">Shipping Address</h2>
            <p style={{ margin: "4px 0" }}><strong>Street:</strong> {shippingAddress.shippingAddress}</p>
            <p style={{ margin: "4px 0" }}><strong>City:</strong> {shippingAddress.city}</p>
            <p style={{ margin: "4px 0" }}><strong>Postal Code:</strong> {shippingAddress.postalCode}</p>
          </div>

          {/* Payment Review */}
          <div className="checkout-card">
            <h2 className="checkout-card-title">Payment Method</h2>
            <p style={{ fontWeight: "600", color: "var(--primary-color)" }}>
              {paymentMethod === "COD" ? "💵 Cash On Delivery (COD)" : 
               paymentMethod === "UPI" ? "⚡ UPI / Instant Transfer" : "💳 Debit / Credit Card"}
            </p>
          </div>

          {/* Items Review */}
          <div className="checkout-card">
            <h2 className="checkout-card-title">Items Review</h2>
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
                <div style={{ fontWeight: "600" }}>
                  ₹{item.price * item.qty}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Final Pricing Review */}
        <div className="checkout-card" style={{ height: "fit-content" }}>
          <h2 className="checkout-card-title">Billing Review</h2>
          <div className="pricing-breakdown">
            <div className="pricing-row">
              <span>Total Items ({totalItems})</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="pricing-row">
              <span>Delivery Charges</span>
              <span style={{ color: "#16a34a", fontWeight: "600" }}>FREE</span>
            </div>
            <div className="pricing-row grand-total">
              <span>Grand Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>

          <button 
            className="btn-checkout-action" 
            onClick={placeOrderHandler}
            style={{ marginTop: "24px" }}
          >
            {paymentMethod === "COD" ? "Place COD Order" : "Pay with Razorpay Gateway"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;