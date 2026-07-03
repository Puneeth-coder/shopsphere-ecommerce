import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";

const PlaceOrderPage = () => {
  const navigate = useNavigate();

  const { cartItems, clearCart } =
    useCart();

  const shippingAddress =
    JSON.parse(
      localStorage.getItem(
        "shippingAddress"
      )
    ) || {};

  const paymentMethod =
    localStorage.getItem(
      "paymentMethod"
    ) || "COD";

  const totalItems =
    cartItems.reduce(
      (acc, item) =>
        acc + item.qty,
      0
    );

  const totalPrice =
    cartItems.reduce(
      (acc, item) =>
        acc +
        item.price * item.qty,
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

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "20px auto",
        padding: "20px",
      }}
    >
      <h1>Place Order</h1>

      <h2>Shipping Address</h2>

      <p>
        {
          shippingAddress.shippingAddress
        }
      </p>

      <p>
        {shippingAddress.city}
      </p>

      <p>
        {
          shippingAddress.postalCode
        }
      </p>

      <hr />

      <h2>Payment Method</h2>

      <p>{paymentMethod}</p>

      <hr />

      <h2>Order Items</h2>

      {cartItems.map(
        (item) => (
          <div
            key={item._id}
          >
            <p>
              {item.name} ×{" "}
              {item.qty}
            </p>
          </div>
        )
      )}

      <hr />

      <h3>
        Total Items:
        {" "}
        {totalItems}
      </h3>

      <h2>
        Total Price:
        ₹{totalPrice}
      </h2>

      <button
        onClick={
          placeOrderHandler
        }
      >
        Place Order
      </button>
    </div>
  );
};

export default PlaceOrderPage;