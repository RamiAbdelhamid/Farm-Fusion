import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
const CartContext = createContext();

//this component provides a context for managing the shopping cart state and actions. 
/**************************************************************************************************** */

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error parsing cart items:", error);
      return [];
    }
  });
  /**************************************************************************************************** */
const [showCart, setShowCart] = useState(false);


  // Load cart items from localStorage when the component mounts
  /**************************************************************************************************** */
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);
  /**************************************************************************************************** */
  /**************************************************************************************************** */
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);

      if (existingItem) {
        toast.success(`Increased quantity for ${product.name}`);
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        toast.success(`${product.name} added to cart`);
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };
  /**************************************************************************************************** */
  /**************************************************************************************************** */

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const removedItem = prevItems.find((item) => item._id === productId);
      if (removedItem) {
        toast.success(`${removedItem.name} removed from cart`);
      }
      return prevItems.filter((item) => item._id !== productId);
    });
  };
  /**************************************************************************************************** */
  /**************************************************************************************************** */

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  /**************************************************************************************************** */
  /**************************************************************************************************** */

  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared");
  };
  /**************************************************************************************************** */
  /**************************************************************************************************** */

  const totalItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );
  /**************************************************************************************************** */
  /**************************************************************************************************** */
  const cartTotal = cartItems
    .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
    .toFixed(2);
  /**************************************************************************************************** */

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        cartTotal,
        showCart,
        setShowCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
