import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const { cartItems } = useCart();

  const [shippingAddress, setShippingAddress] =
    useState("");

  const [city, setCity] =
    useState("");

  const [postalCode, setPostalCode] =
    useState("");

  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc + item.price * item.qty,
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

    alert(
      "Address Saved Successfully!"
    );

    console.log(addressData);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "20px auto",
      }}
    >
      <h1>Checkout</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Address"
          value={shippingAddress}
          onChange={(e) =>
            setShippingAddress(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) =>
            setCity(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) =>
            setPostalCode(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <button type="submit">
          Save Address
        </button>
      </form>

      <hr />

      <h2>Order Summary</h2>

      {cartItems.map((item) => (
        <div
    key={item._id}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "15px",
    }}
  >
    <img
      src={`http://localhost:5000${item.image}`}
      alt={item.name}
      width="80"
      height="80"
      style={{
        objectFit: "cover",
        borderRadius: "8px",
      }}
    />

    <div>
      <p>
        {item.name} × {item.qty}
      </p>

      <p>
        ₹{item.price}
      </p>
    </div>
  </div>
      ))}

      <h3>
        Total: ₹{totalPrice}
      </h3>
      <Link to="/payment">
  <button>
    Continue To Payment
  </button>
</Link>
    </div>
  );
};

export default CheckoutPage;