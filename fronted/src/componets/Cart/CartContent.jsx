import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
import {
  updateCartItemQuantity,
  removeFromCart,
} from "../../../redux/slices/cartSlice";
import "./CartContent.css";

function CartContent() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const { user } = useSelector((state) => state.auth);

  if (!cart || !cart.products || cart.products.length === 0) {
    return <p className="cart-empty">Your cart is empty.</p>;
  }

  const items = cart.products;

  const handleUpdateQty = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      dispatch(
        removeFromCart({
          productId: item.productId,
          size: item.size,
          color: item.color,
          userId: user ? user._id : null,
        })
      );
    } else {
      dispatch(
        updateCartItemQuantity({
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: newQty,
          userId: user ? user._id : null,
        })
      );
    }
  };

  const handleRemove = (item) => {
    dispatch(
      removeFromCart({
        productId: item.productId,
        size: item.size,
        color: item.color,
        userId: user ? user._id : null,
      })
    );
  };

  return (
    <div className="cart-list">
      {items.map((item) => (
        <div
          key={`${item.productId}-${item.size}-${item.color}`}
          className="cart-row"
        >
          {/* main - 1 */}
          {/* main div */}
          {/* image | details */}
          <div className="cart-row-main">

            {/* 1 */}
            {/* left - image */}
            <div className="cart-img-wrap">
              <img src={item.image} alt={item.name} className="cart-img" />
            </div>

            {/* 2 */}
            {/* right - details */}
            <div className="cart-details-wrap">
              <div className="cart-title">{item.name}</div>
              <div className="cart-meta">
                <span>Size: <b>{item.size}</b></span>
                <span>Color: <b>{item.color}</b></span>
              </div>
              <div className="cart-qty-block">
                <button onClick={() => handleUpdateQty(item, -1)}>-</button>
                <span className="cart-qty">{item.quantity}</span>
                <button onClick={() => handleUpdateQty(item, 1)}>+</button>
              </div>
            </div>
          </div>


          {/* main - 2 */}
          {/* left   |    right */}
          <div className="cart-row-side">

            {/* 1 */}
            {/* left - price */}
            <div className="cart-price">
              Price: ₹{(item.quantity * item.price).toFixed(2)}
            </div>

            {/* 2 */}
            {/* right - delete */}
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
      ))}
      <div className="cart-total-block">
        <span>Total:</span>
        <span>₹{cart.totalPrice ? cart.totalPrice.toFixed(2) : "0.00"}</span>
      </div>
    </div>
  );
}

export default CartContent;
