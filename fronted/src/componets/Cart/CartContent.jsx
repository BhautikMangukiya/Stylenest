import React, { useState, useContext } from "react";
import { MdDeleteForever } from "react-icons/md";
import "./CartContent.css";

// Create CartContext
const CartContext = React.createContext();

// Cart Provider component
export const CartProvider = ({ children }) => {
  const [cartProducts, setCartProducts] = useState([]);

  // Add to cart function
  const addToCart = (product) => {
    setCartProducts((prev) => {
      // Check if product already exists in cart
      const existingProduct = prev.find(
        (item) => 
          item.productId === product.productId &&
          item.size === product.size &&
          item.color === product.color
      );
      
      if (existingProduct) {
        // Update quantity if product exists
        return prev.map((item) =>
          item.productId === product.productId &&
          item.size === product.size &&
          item.color === product.color
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      // Add new product if it doesn't exist
      return [...prev, product];
    });
  };

  // Update quantity
  const updateQuantity = (productId, delta) => {
    setCartProducts((prev) =>
      prev.map((product) =>
        product.productId === productId
          ? { ...product, quantity: Math.max(1, product.quantity + delta) }
          : product
      )
    );
  };

  // Remove item
  const removeProduct = (productId) => {
    setCartProducts((prev) => prev.filter((product) => product.productId !== productId));
  };

  // Calculate total price
  const totalPrice = cartProducts.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  return (
    <CartContext.Provider 
      value={{ 
        cartProducts, 
        addToCart, 
        updateQuantity, 
        removeProduct, 
        totalPrice 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Cart Content Component
function CartContent() {
  const { 
    cartProducts, 
    updateQuantity, 
    removeProduct, 
    totalPrice 
  } = useCart();

  if (cartProducts.length === 0) {
    return (
      <div className="cart-container">
        <p className="empty-cart">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {cartProducts.map((product) => (
        <div key={`${product.productId}-${product.size}-${product.color}`} className="cart-product">
          <div className="cart-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="cart-details">
            <div className="product-title">
              <h3>{product.name}</h3>
              <span>Size: {product.size}</span>
              <span>Color: {product.color}</span>
            </div>

            <div className="quantity-control">
              <button 
                onClick={() => updateQuantity(product.productId, -1)}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span>{product.quantity}</span>
              <button 
                onClick={() => updateQuantity(product.productId, 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="cart-actions">
            <p className="price">${(product.price * product.quantity).toFixed(2)}</p>
            <button
              onClick={() => removeProduct(product.productId)}
              aria-label="Remove product"
            >
              <MdDeleteForever />
            </button>
          </div>
        </div>
      ))}
      
      <div className="cart-total">
        <span>Total:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default CartContent;