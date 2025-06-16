import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CartContent from "../../Cart/CartContent";
import { fetchCart } from "../../../../redux/slices/cartSlice";

import "./CartPage.css";

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart.cart);

  // 🔄 Always fetch cart on mount
  useEffect(() => {
    dispatch(fetchCart({ userId: user?._id || null }));
  }, [dispatch, user]);

  const handleCheckout = () => {
    if (user) {
      navigate("/checkout");
    } else {
      navigate("/login?redirect=/checkout");
    }
  };

  return (
    <div className="cartpage-container">
      <h1 className="cartpage-title">Shopping Bag</h1>

      <CartContent />

      {cart?.products?.length > 0 && (
        <div className="cartpage-footer">
          <button className="cartpage-checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
