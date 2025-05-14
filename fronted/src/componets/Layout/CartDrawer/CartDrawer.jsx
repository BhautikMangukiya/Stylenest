import React from "react";
import { IoMdClose } from "react-icons/io";
import "./CartDrawer.css";
import CartContent from "../../Cart/CartContent";
import {useNavigate} from "react-router-dom"

function CartDrawer({ drawerOpen, toggleCartDrawer, cartProducts, updateQuantity, handleRemoveProduct }) {
  
  const navigate = useNavigate()

  const handleChekOut = () => {
    navigate("/chekout")
  }
  
  return (
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
        <button className="chekout-button" onClick={handleChekOut}>CheckOut</button>
        <p>Shipping, taxes, and discounts codes calculated at CheckOut</p>
      </div>
    </div>
  );
}

export default CartDrawer;
