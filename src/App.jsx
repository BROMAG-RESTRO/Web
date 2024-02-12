import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div data-theme="light">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;
