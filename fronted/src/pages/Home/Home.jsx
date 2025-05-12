import React from "react";
import MenWomen from "../../componets/Products/MenWomen/MenWomen";
import NewArrivals from "../../componets/Products/NewArrivals/NewArrivals";
import Hero from "../../componets/Layout/hero/Hero";
import BestSeller from "../../componets/Products/BestSeller/BestSeller";


function Home() {
  return (
    <div>
      <Hero />
      <MenWomen />
      <NewArrivals />
      <BestSeller />
    </div>
  );
}

export default Home;
