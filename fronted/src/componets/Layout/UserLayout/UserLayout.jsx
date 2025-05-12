import React from "react";
import Header from "../../Comman/Header/Header";
import Footer from "../../Comman/Footer/Footer";
import { Outlet } from "react-router-dom";


const UserLayout = () => {
  return (
    <>
      {/* header */}
      <Header /> 
      {/* main Content */}
      <main>
        <Outlet />
      </main>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default UserLayout;
