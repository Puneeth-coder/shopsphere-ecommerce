import { useState } from "react";
import { Link } from "react-router-dom";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  const submitHandler = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "paymentMethod",
      paymentMethod
    );

    alert(
      "Payment Method Saved Successfully!"
    );

    console.log(
      "Selected Payment:",
      paymentMethod
    );
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      <h1>Payment Method</h1>

      <form onSubmit={submitHandler}>
        <div>
          <input
            type="radio"
            id="cod"
            value="COD"
            checked={
              paymentMethod === "COD"
            }
            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }
          />

          <label htmlFor="cod">
            Cash On Delivery (COD)
          </label>
        </div>

        <br />

        <div>
          <input
            type="radio"
            id="upi"
            value="UPI"
            checked={
              paymentMethod === "UPI"
            }
            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }
          />

          <label htmlFor="upi">
            UPI
          </label>
        </div>

        <br />

        <div>
          <input
            type="radio"
            id="card"
            value="Card"
            checked={
              paymentMethod === "Card"
            }
            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }
          />

          <label htmlFor="card">
            Debit / Credit Card
          </label>
        </div>

        <br />

        <h3
          style={{
            color: "green",
          }}
        >
          Selected Payment Method:
          {" "}
          {paymentMethod}
        </h3>

        <button type="submit">
          Save Payment Method
        </button>
        <Link to="/placeorder">
  <button
    style={{
      marginLeft: "10px",
    }}
  >
    Review Order
  </button>
</Link>
      </form>
    </div>
  );
};

export default PaymentPage;