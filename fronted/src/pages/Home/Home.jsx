import React, { useState } from "react";
import MenWomen from "../../componets/Products/MenWomen/MenWomen";
import NewArrivals from "../../componets/Products/NewArrivals/NewArrivals";
import Hero from "../../componets/Layout/hero/Hero";
import BestSeller from "../../componets/Products/BestSeller/BestSeller";
import FeaturedCollection from "../../componets/Products/FeaturedCollection/FeaturedCollection"
import CartDrawer from "../../componets/Layout/CartDrawer/CartDrawer"; // Import CartDrawer
import { toast } from "sonner"; // Import toast for notifications
import FeturedSection from "../../componets/Layout/FeturedSection/FeturedSection";


function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);



  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAddToCart = (product) => {
    setCartProducts((prevProducts) => {
      const existingProduct = prevProducts.find(
        (item) => item.productId === product.productId
      );
      if (existingProduct) {
        return prevProducts.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevProducts, { ...product, quantity: 1 }];
      }
    });
    toast.success("Item added to cart", { position: "top-right" });
  };

  const updateQuantity = (productId, delta) => {
    setCartProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productId === productId
          ? { ...product, quantity: Math.max(1, product.quantity + delta) }
          : product
      )
    );
  };

  const handleRemoveProduct = (productId) => {
    setCartProducts((prevProducts) =>
      prevProducts.filter((product) => product.productId !== productId)
    );
  };

  return (
    <div>
      <Hero />
      <MenWomen handleAddToCart={handleAddToCart} />
      <NewArrivals handleAddToCart={handleAddToCart} />
      <BestSeller handleAddToCart={handleAddToCart} />
      <FeaturedCollection />
      <FeturedSection />

      {/* Cart Drawer */}
      <CartDrawer
        drawerOpen={drawerOpen}
        toggleCartDrawer={toggleCartDrawer}
        cartProducts={cartProducts}
        updateQuantity={updateQuantity}
        handleRemoveProduct={handleRemoveProduct}
      />
    </div>
  );
}

export default Home;
