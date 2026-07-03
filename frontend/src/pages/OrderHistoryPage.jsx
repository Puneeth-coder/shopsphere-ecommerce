import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const OrderHistoryPage =
  () => {

  const [orders,
    setOrders] =
    useState([]);

  useEffect(() => {

    const fetchOrders =
      async () => {

      try {

        const response =
          await api.get(
            "/orders"
          );

        setOrders(
          response.data.orders
        );

      } catch (error) {

        console.log(error);

      }
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
        padding:
          "20px",
      }}
    >
      <h1>
        Order History
      </h1>

      {orders.length ===
      0 ? (
        <p>
          No Orders Found
        </p>
      ) : (
        orders.map(
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
                borderRadius:
                  "10px",
              }}
            >
              <h3>
                Order ID
              </h3>

              <p>
                {order._id}
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

              <p>
                Date:
                {" "}
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </p>
            </div>
          )
        )
      )}
    </div>
  );
};

export default
  OrderHistoryPage;