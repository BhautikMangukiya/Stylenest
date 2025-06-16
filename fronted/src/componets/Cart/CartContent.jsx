// --- Frontend: CartContent.jsx ---
import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { MdDeleteForever } from 'react-icons/md';
import {
  updateCartItemQuantity,
  removeFromCart,
  fetchCart,
} from '../../../redux/slices/cartSlice';

import './CartContent.css';

function CartContent() {
  const dispatch = useDispatch();
  const { cart, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCart({ userId: user?._id || null }));
  }, [dispatch, user]);

  if (!cart || !cart.products?.length) {
    return <p className="cart-empty">Your cart is empty.</p>;
  }

  const handleUpdateQty = (item, delta) => {
    const updatedQty = (Number(item.quantity) || 1) + delta;
    const payload = {
      productId: item.productId?._id || item.productId,
      size: item.size?.toString() || '',
      color: item.color?.toString() || '',
      userId: user?._id || null,
    };

    if (updatedQty <= 0) {
      dispatch(removeFromCart(payload));
    } else {
      dispatch(updateCartItemQuantity({ ...payload, quantity: updatedQty }));
    }
  };

  const handleRemove = (item) => {
    const payload = {
      productId: item.productId?._id || item.productId,
      size: item.size?.toString() || '',
      color: item.color?.toString() || '',
      userId: user?._id || null,
    };
    dispatch(removeFromCart(payload));
  };

  return (
    <div className="cart-list">
      {error && <p className="cart-error">{error}</p>}
      {cart.products.map((item, idx) => {
        if (!item.productId) {
          console.warn('Skipping invalid cart item at index', idx);
          return null;
        }
        const key = `${item.productId._id || item.productId}-${item.size}-${item.color}`;

        return (
          <div key={key} className="cart-row">
            <div className="cart-row-main">
              <div className="cart-img-wrap">
                <img src={item.image} alt={item.name} className="cart-img" />
              </div>
              <div className="cart-details-wrap">
                <div className="cart-title">{item.name}</div>
                <div className="cart-meta">
                  <span>Size: <b>{item.size || 'N/A'}</b></span>
                  <span>Color: <b>{item.color || 'N/A'}</b></span>
                </div>
                <div className="cart-qty-block">
                  <button onClick={() => handleUpdateQty(item, -1)}>-</button>
                  <span className="cart-qty">{item.quantity}</span>
                  <button onClick={() => handleUpdateQty(item, 1)}>+</button>
                </div>
              </div>
            </div>
            <div className="cart-row-side">
              <div className="cart-price">
                ₹{(item.quantity * item.price).toFixed(2)}
              </div>
              <button
                className="cart-delete-btn"
                onClick={() => handleRemove(item)}
                aria-label="Remove item"
                title="Remove"
              >
                <MdDeleteForever />
              </button>
            </div>
          </div>
        );
      })}
      <div className="cart-total-block">
        <span>Total:</span>
        <span>₹{cart.totalPrice?.toFixed(2) || '0.00'}</span>
      </div>
    </div>
  );
}

export default CartContent;