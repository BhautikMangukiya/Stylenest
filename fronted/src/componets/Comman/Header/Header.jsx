import React from "react";
import Topbar from "../../Layout/Topbar/Topbar";
import Navbar from "../Navbar/Navbar";

function Header() {
  return (
    <header className="site-header">
      <Topbar />
      <Navbar />
      {/* Cart Drawer will be added here later if needed */}
    </header>
  );
}

export default Header;