import React, { useState } from "react";
import "./CartContent.css";
import { MdDeleteForever } from "react-icons/md";

function CartContent() {
  const [cartProducts, setCartProducts] = useState([
    {
      productId: 1,
      name: "T-shirt",
      size: "M",
      color: "Red",
      quantity: 1,
      price: 15,
      image: "https://picsum.photos/200?random=1",
    },
    {
      productId: 2,
      name: "Jeans",
      size: "L",
      color: "Blue",
      quantity: 2,
      price: 40,
      image: "https://picsum.photos/200?random=2",
    },
    {
      productId: 3,
      name: "Sneakers",
      size: "9",
      color: "White",
      quantity: 1,
      price: 60,
      image: "https://picsum.photos/200?random=3",
    },
    {
      productId: 4,
      name: "Hoodie",
      size: "XL",
      color: "Black",
      quantity: 1,
      price: 35,
      image: "https://picsum.photos/200?random=4",
    },
    {
      productId: 5,
      name: "Cap",
      size: "One Size",
      color: "Green",
      quantity: 3,
      price: 10,
      image: "https://picsum.photos/200?random=5",
    },
    {
      productId: 6,
      name: "Jacket",
      size: "M",
      color: "Gray",
      quantity: 1,
      price: 80,
      image: "https://picsum.photos/200?random=6",
    },
  ]);

  // Update quantity
  const updateQuantity = (productId, delta) => {
    setCartProducts(cartProducts.map(product =>
      product.productId === productId
        ? { ...product, quantity: Math.max(1, product.quantity + delta) }
        : product
    ));
  };

  // Remove item
  const handleRemoveProduct = (productId) => {
    setCartProducts(cartProducts.filter(product => product.productId !== productId));
  };

  // Calculate total price
  const totalPrice = cartProducts.reduce((total, product) => total + product.price * product.quantity, 0);

  return (
    <div className="cart-container">
      {cartProducts.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          {cartProducts.map((product) => (
            <div key={product.productId} className="cart-product">
              {/* Product Image */}
              <div className="cart-image">
                <img src={product.image} alt={product.name} />
              </div>
        
              {/* Product Info */}
              <div className="cart-details">
                <div className="product-title">
                  <h3>{product.name}</h3>
                  <span>Size: {product.size}</span>
                  <span>Color: {product.color}</span>
                </div>
        
                <div className="quantity-control">
                  <button className="dec" onClick={() => updateQuantity(product.productId, -1)}>-</button>
                  <span>{product.quantity}</span>
                  <button className="inc" onClick={() => updateQuantity(product.productId, 1)}>+</button>
                </div>
              </div>
        
              {/* Price and Delete */}
              <div className="cart-actions">
                <p className="price">${(product.price * product.quantity).toFixed(2)}</p>
                <button 
                  className="delete-btn" 
                  onClick={() => handleRemoveProduct(product.productId)}
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
        </>
      )}
    </div>
  );
}

export default CartContent;

//.....
// ///// 