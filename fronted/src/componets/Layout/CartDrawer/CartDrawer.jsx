import React from "react";
import { IoMdClose } from "react-icons/io";
import "./CartDrawer.css";
import CartContent from "../../Cart/CartContent";
import { useNavigate } from "react-router-dom";

function CartDrawer({ drawerOpen, toggleCartDrawer, cartProducts, updateQuantity, handleRemoveProduct }) {
  const navigate = useNavigate();

  const handleCheckOut = () => {
    navigate("/checkout");
  };

  // Close drawer when clicking outside (on backdrop)
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("cart-drawer-backdrop")) {
      toggleCartDrawer();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="cart-drawer-backdrop"
          onClick={handleBackdropClick}
        ></div>
      )}

      {/* Cart Drawer */}
      <div className={`cart-drawer ${drawerOpen ? "open" : ""}`}>
        {/* Header with Title and Close Button */}
        <div className="drawer-header">
          <h2 className="cart-title">Your Cart</h2>
          <button onClick={toggleCartDrawer} className="close-btn">
            <IoMdClose className="close-button" />
          </button>
        </div>
        {/* Divider */}
        <div className="divider"></div>

        {/* Drawer Content */}
        <div className="drawer-content">
          <CartContent
            cartProducts={cartProducts}
            updateQuantity={updateQuantity}
            handleRemoveProduct={handleRemoveProduct}
          />
        </div>

        {/* Checkout Button */}
        <div className="checkOut-button">
          <button className="chekout-button" onClick={handleCheckOut}>
            CheckOut
          </button>
          <p>Shipping, taxes, and discount codes calculated at CheckOut</p>
        </div>
      </div>
    </>
  );
}

export default CartDrawer;