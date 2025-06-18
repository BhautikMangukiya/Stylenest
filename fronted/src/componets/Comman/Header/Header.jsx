import React from "react";
import Topbar from "../../Layout/Topbar/Topbar";
import Navbar from "../Navbar/Navbar";

function Header() {
  return (
    <header className="site-header">
      <Topbar />
      <Navbar />
    </header>
  );
}

export default Header;