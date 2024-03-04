import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { onMessageListener, requestPermission } from "./helper/firebase";
import { notification } from "antd";
import sound from "./assets/notify.mp3";
const App = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    requestPermission();

    console.log("liseners");
    const unsubscribe = onMessageListener().then((payload) => {
      console.log("foreground payload", payload);
      const audio = new Audio(sound);
      if (audio) {
        audio?.play();
      }
      notification.success({
        message: payload?.data?.body,
      });
    });

    return () => {
      unsubscribe.catch((err) => console.log("failed: ", err));
    };
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
