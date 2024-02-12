import React from "react";
import Navbar from "../../components/Navbar";

import { Outlet } from "react-router-dom";
import Profile from "./index";
import Footer from "../../components/Footer";

const Layout = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <div className="py-5 flex gap-x-10 justify-start lg:pt-10 pt-5 lg:w-[100%] w-full px-2 min-h-screen lg:flex-row flex-col">
        <div className="lg:block hidden">
          <Profile />
        </div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
