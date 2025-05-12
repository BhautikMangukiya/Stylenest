import React from "react";
import Topbar from "../../Layout/Topbar/Topbar";
import Navbar from "../Navbar/Navbar";




function Header() {
  return (
    <div>
      {/* Topbar */}
      <Topbar />
      {/* navbar */}
       <Navbar />
      {/* Cart Drawer */}
    </div>
  );
}

export default Header;
