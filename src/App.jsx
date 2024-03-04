import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { messaging, requestPermission } from "./helper/firebase";
import { notification } from "antd";
import sound from "./assets/notify.mp3";
import { useDispatch } from "react-redux";
import { setMessage } from "./redux/authSlice";
import { onMessage } from "firebase/messaging";
const App = () => {
  const dispatch = useDispatch();

  async function handleNotify(payload) {
    console.log("notify", payload);
    dispatch(setMessage(payload));
    const audio = new Audio(sound);
    if (audio) {
      audio?.play();
    }
    notification.success({
      message: payload?.data?.body,
    });
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    requestPermission();
  }, []);

  onMessage(messaging, (data) => {
    console.log("foreground messsager", data);
    handleNotify(data);
  });

  return (
    <div data-theme="light">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;
