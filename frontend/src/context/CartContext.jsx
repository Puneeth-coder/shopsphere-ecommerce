import {
  createContext,
  useContext,
  useState,
} from "react";

const CartContext =
  createContext();

export const CartProvider =
({ children }) => {

  const [cartItems,
    setCartItems] =
    useState(() => {

      const savedCart =
        localStorage.getItem(
          "cartItems"
        );

      return savedCart
        ? JSON.parse(savedCart)
        : [];
    });

  const addToCart =
    (product) => {

      const existItem =
        cartItems.find(
          (item) =>
            item._id ===
            product._id
        );

      let updatedCart;

      if (existItem) {

        updatedCart =
          cartItems.map(
            (item) =>
              item._id ===
              product._id
                ? {
                    ...item,
                    qty:
                      item.qty + 1,
                  }
                : item
          );

      } else {

        updatedCart = [
          ...cartItems,
          {
            ...product,
            qty: 1,
          },
        ];
      }

      setCartItems(
        updatedCart
      );

      localStorage.setItem(
        "cartItems",
        JSON.stringify(
          updatedCart
        )
      );
    };

  const increaseQty =
    (id) => {

      const updatedCart =
        cartItems.map(
          (item) =>
            item._id === id
              ? {
                  ...item,
                  qty:
                    item.qty + 1,
                }
              : item
        );

      setCartItems(
        updatedCart
      );

      localStorage.setItem(
        "cartItems",
        JSON.stringify(
          updatedCart
        )
      );
    };

  const decreaseQty =
    (id) => {

      const updatedCart =
        cartItems.map(
          (item) =>
            item._id === id &&
            item.qty > 1
              ? {
                  ...item,
                  qty:
                    item.qty - 1,
                }
              : item
        );

      setCartItems(
        updatedCart
      );

      localStorage.setItem(
        "cartItems",
        JSON.stringify(
          updatedCart
        )
      );
    };

  const removeFromCart =
    (id) => {

      const updatedCart =
        cartItems.filter(
          (item) =>
            item._id !== id
        );

      setCartItems(
        updatedCart
      );

      localStorage.setItem(
        "cartItems",
        JSON.stringify(
          updatedCart
        )
      );
    };

  const clearCart = () => {

    setCartItems([]);

    localStorage.removeItem(
      "cartItems"
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart =
  () =>
    useContext(
      CartContext
    );