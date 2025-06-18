import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../Comman/Header/Header";
import Footer from "../../Comman/Footer/Footer";

const UserLayout = () => {
  const location = useLocation();
  const hideOnPaths = ["/login", "/register"];
  const shouldHideLayout = hideOnPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideLayout && <Header />}

      <main>
        <Outlet />
      </main>

      {!shouldHideLayout && <Footer />}
    </>
  );
};

export default UserLayout;
