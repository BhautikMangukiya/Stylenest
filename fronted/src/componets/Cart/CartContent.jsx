import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
import {
  updateCartItemQuantity,
  removeFromCart,
} from "../../../redux/slices/cartSlice"; // Adjust based on your folder structure
import "./CartContent.css";

function CartContent() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);

  const handleUpdateQty = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      dispatch(removeFromCart(item));
    } else {
      dispatch(updateCartItemQuantity({ ...item, quantity: newQty }));
    }
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart(item));
  };

  const total = cart.reduce((sum, p) => sum + p.quantity * p.price, 0);

  if (cart.length === 0) {
    return <p className="empty-cart">Your cart is empty.</p>;
  }

  return (
    <div className="cart-container">
      {cart.map((item) => (
        <div
          key={`${item.productId}-${item.size}-${item.color}`}
          className="cart-product"
        >
          <div className="cart-img-info">
            <div className="cart-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="cart-details">
              <h3>{item.name}</h3>
              <span>Size: {item.size}</span>
              <span>Color: {item.color}</span>

              <div className="quantity-control">
                <button onClick={() => handleUpdateQty(item, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleUpdateQty(item, 1)}>+</button>
              </div>
            </div>
          </div>

          <div className="cart-actions">
            <p className="price">${(item.quantity * item.price).toFixed(2)}</p>
            <button onClick={() => handleRemove(item)}>
              <MdDeleteForever className="product-remove-button-cart" />
            </button>
          </div>
        </div>
      ))}

      <div className="cart-total">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default CartContent;
