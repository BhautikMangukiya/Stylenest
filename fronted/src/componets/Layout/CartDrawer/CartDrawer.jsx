import React from "react";
import { IoMdClose } from "react-icons/io";
import "./CartDrawer.css";
import CartContent from "../../Cart/CartContent";
import { useNavigate } from "react-router-dom";

function CartDrawer({ drawerOpen, toggleCartDrawer }) {
  const navigate = useNavigate();

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("cart-drawer-backdrop")) {
      toggleCartDrawer();
    }
  };

  return (
    <>
      {drawerOpen && (
        <div
          className="cart-drawer-backdrop"
          onClick={handleBackdropClick}
        ></div>
      )}

      <div className={`cart-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h2 className="cart-title">Your Cart</h2>
          <button onClick={toggleCartDrawer} className="close-btn">
            <IoMdClose className="close-button" />
          </button>
        </div>

        <div className="divider"></div>

        <div className="drawer-content">
          <CartContent />
        </div>

        <div className="checkOut-button">
          <button className="chekout-button" onClick={() => navigate("/checkout")}>
            CheckOut
          </button>
          <p>Shipping, taxes, and discount codes calculated at CheckOut</p>
        </div>
      </div>
    </>
  );
}

export default CartDrawer;
