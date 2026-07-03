import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AdminOrdersPage =
  () => {

  const [orders,
    setOrders] =
    useState([]);

  useEffect(() => {

    const fetchOrders =
      async () => {

      const response =
        await api.get(
          "/orders"
        );

      setOrders(
        response.data.orders
      );
    };

    fetchOrders();

  }, []);

  return (
    <div
      style={{
        maxWidth:
          "900px",
        margin:
          "20px auto",
      }}
    >
      <h1>
        Manage Orders
      </h1>

      {orders.map(
        (order) => (
          <div
            key={
              order._id
            }
            style={{
              border:
                "1px solid #ddd",
              padding:
                "15px",
              marginBottom:
                "15px",
            }}
          >
            <p>
              Order:
              {" "}
              {
                order._id
              }
            </p>

            <p>
              Total:
              ₹
              {
                order.totalPrice
              }
            </p>

            <p>
              Payment:
              {" "}
              {
                order.paymentMethod
              }
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default
  AdminOrdersPage;