import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import MenWomen from "../../componets/Products/MenWomen/MenWomen";
import NewArrivals from "../../componets/Products/NewArrivals/NewArrivals";
import Hero from "../../componets/Layout/hero/Hero";
import BestSeller from "../../componets/Products/BestSeller/BestSeller";
import FeaturedCollection from "../../componets/Products/FeaturedCollection/FeaturedCollection";
import CartDrawer from "../../componets/Layout/CartDrawer/CartDrawer";
import FeturedSection from "../../componets/Layout/FeturedSection/FeturedSection";
import { 
  fetchProductsByFilters,
  fetchBestSellers,
  fetchNewArrivals 
} from "../../../redux/slices/productsSlice";

function Home() {
  const dispatch = useDispatch();
  const { 
    products, 
    loading, 
    error,
    bestSellers,
    newArrivals
  } = useSelector((state) => state.products);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    // Fetch products by filters
    dispatch(fetchProductsByFilters({
      gender: "Women",
      category: "Bottom Wear",
      limit: 8
    }));

    // Fetch best-selling products
    dispatch(fetchBestSellers());

    // Fetch new arrivals
    dispatch(fetchNewArrivals());

    // Fetch featured products
    // const fetchFeaturedProducts = async () => {
    //   try {
    //     const response = await axios.get(
    //       `${import.meta.env.VITE_BACKEND_URL}/api/products/featured`
    //     );
    //     setFeaturedProducts(response.data);
    //   } catch (error) {
    //     console.error("Error fetching featured products:", error);
    //     toast.error("Failed to load featured products");
    //   }
    // };

    // fetchFeaturedProducts();
  }, [dispatch]);

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAddToCart = (product) => {
    setCartProducts((prevProducts) => {
      const existingProduct = prevProducts.find(
        (item) => item._id === product._id
      );
      if (existingProduct) {
        return prevProducts.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevProducts, { ...product, quantity: 1 }];
      }
    });
    toast.success("Item added to cart");
    if (!drawerOpen) setDrawerOpen(true);
  };

  const updateQuantity = (productId, delta) => {
    setCartProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
          ? { ...product, quantity: Math.max(1, product.quantity + delta) }
          : product
      )
    );
  };

  const handleRemoveProduct = (productId) => {
    setCartProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== productId)
    );
    toast.info("Item removed from cart");
  };

  return (
    <div className="home-page">
      <Hero />
      <MenWomen 
        products={products} 
        loading={loading} 
        error={error} 
        handleAddToCart={handleAddToCart} 
      />
      <NewArrivals 
        products={newArrivals}
        handleAddToCart={handleAddToCart} 
      />
      <BestSeller 
        products={bestSellers} 
        handleAddToCart={handleAddToCart} 
      />
      <FeaturedCollection 
        products={featuredProducts} 
        handleAddToCart={handleAddToCart} 
      />
      <FeturedSection />

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