import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/checkout.css";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data.orders);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="checkout-container">
      <h1 className="cart-title" style={{ marginBottom: "28px" }}>Your Order History</h1>

      {orders.length === 0 ? (
        <div className="cart-empty">
          <h3>No Orders Found</h3>
          <p style={{ marginTop: "8px" }}>You haven't placed any purchases yet.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-history-card">
            <div className="order-meta-group">
              <span className="order-meta-label">Order Reference</span>
              <span className="order-meta-value" style={{ fontSize: "0.85rem", color: "var(--text-color)" }}>
                {order._id}
              </span>
            </div>

            <div className="order-meta-group">
              <span className="order-meta-label">Purchase Date</span>
              <span className="order-meta-value" style={{ fontWeight: "500", color: "var(--text-color)" }}>
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            <div className="order-meta-group">
              <span className="order-meta-label">Transaction Method</span>
              <span className="order-meta-value" style={{ fontWeight: "500", color: "var(--text-color)" }}>
                {order.paymentMethod === "COD" ? "Cash On Delivery (COD)" : 
                 order.paymentMethod === "UPI" ? "UPI Gateway" : "Credit/Debit Card"}
              </span>
            </div>

            <div className="order-meta-group">
              <span className="order-meta-label">Amount Billed</span>
              <span className="order-meta-value">₹{order.totalPrice}</span>
            </div>

            <div className="order-meta-group">
              <span className="order-meta-label">Payment Status</span>
              <span className={`order-status-badge ${order.isPaid ? 'order-status-paid' : 'order-status-pending'}`}>
                {order.isPaid ? "Paid" : "Pending (COD)"}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistoryPage;